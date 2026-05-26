from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.incident import Incident
from app.services.intelligence_service import (
    build_correlation_response,
    build_major_summary,
    get_related_incidents,
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_incident_or_404(db: Session, incident_id: int):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    return incident


@router.get("/incidents/{incident_id}/correlation")
def get_incident_correlation(
    incident_id: int,
    db: Session = Depends(get_db),
):
    current_incident = get_incident_or_404(db, incident_id)
    related_incidents = get_related_incidents(db, current_incident)

    return build_correlation_response(current_incident, related_incidents)


@router.get("/incidents/{incident_id}/major-summary")
def get_major_incident_summary(
    incident_id: int,
    db: Session = Depends(get_db),
):
    current_incident = get_incident_or_404(db, incident_id)
    related_incidents = get_related_incidents(db, current_incident)

    return build_major_summary(current_incident, related_incidents)