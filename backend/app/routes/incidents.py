from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.incident import Incident
from app.models.incident_update import IncidentUpdate
from app.models.user import User

from app.schemas.incident_schema import (
    IncidentResponse,
    IncidentUpdate as IncidentUpdateSchema,
)

from app.schemas.incident_update_schema import (
    IncidentUpdateResponse,
)

from app.utils.auth_dependencies import (
    require_roles,
)

router = APIRouter()


def add_incident_update(
    db: Session,
    incident_id: int,
    update_type: str,
    message: str,
    created_by: str = "SYSTEM",
):
    update = IncidentUpdate(
        incident_id=incident_id,
        update_type=update_type,
        message=message,
        created_by=created_by,
    )

    db.add(update)

    return update


@router.get("/incidents", response_model=list[IncidentResponse])
def get_incidents(
    status: str | None = Query(default=None),
    vendor: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    environment: str | None = Query(default=None),
    error_code: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR", "VIEWER"])
    ),
):
    query = db.query(Incident)

    if status:
        query = query.filter(Incident.status.ilike(status))

    if vendor:
        query = query.filter(Incident.vendor.ilike(vendor))

    if severity:
        query = query.filter(Incident.severity.ilike(severity))

    if environment:
        query = query.filter(Incident.environment.ilike(environment))

    if error_code:
        query = query.filter(Incident.error_code.ilike(error_code))

    return (
        query
        .order_by(Incident.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
def get_incident_by_id(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR", "VIEWER"])
    ),
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


@router.put("/incidents/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: int,
    incident_data: IncidentUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR"])
    ),
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    old_status = incident.status
    old_assignee = incident.assignee

    if incident_data.vendor is not None:
        incident.vendor = incident_data.vendor

    if incident_data.environment is not None:
        incident.environment = incident_data.environment

    if incident_data.severity is not None:
        incident.severity = incident_data.severity

    if incident_data.error_code is not None:
        incident.error_code = incident_data.error_code

    if incident_data.status is not None:
        incident.status = incident_data.status

    if incident_data.assignee is not None:
        incident.assignee = incident_data.assignee

    if (
        incident_data.status is not None
        and old_status != incident.status
    ):
        add_incident_update(
            db=db,
            incident_id=incident.id,
            update_type="STATUS_CHANGE",
            message=(
                f"Status changed from "
                f"{old_status} to {incident.status}."
            ),
            created_by=current_user.email,
        )

    if (
        incident_data.assignee is not None
        and old_assignee != incident.assignee
    ):
        previous_assignee = (
            old_assignee if old_assignee else "Unassigned"
        )

        new_assignee = (
            incident.assignee
            if incident.assignee
            else "Unassigned"
        )

        add_incident_update(
            db=db,
            incident_id=incident.id,
            update_type="ASSIGNEE_CHANGE",
            message=(
                f"Assignee changed from "
                f"{previous_assignee} to {new_assignee}."
            ),
            created_by=current_user.email,
        )

    db.commit()
    db.refresh(incident)

    return incident


@router.get(
    "/incidents/{incident_id}/similar",
    response_model=list[IncidentResponse]
)
def get_similar_incidents(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR", "VIEWER"])
    ),
):
    current_incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if current_incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return (
        db.query(Incident)
        .filter(Incident.id != incident_id)
        .filter(
            Incident.vendor == current_incident.vendor
        )
        .filter(
            Incident.error_code
            == current_incident.error_code
        )
        .order_by(Incident.created_at.desc())
        .all()
    )


@router.get(
    "/incidents/{incident_id}/timeline",
    response_model=list[IncidentUpdateResponse]
)
def get_incident_timeline(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR", "VIEWER"])
    ),
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id
    ).first()

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return (
        db.query(IncidentUpdate)
        .filter(
            IncidentUpdate.incident_id == incident_id
        )
        .order_by(IncidentUpdate.created_at.asc())
        .all()
    )