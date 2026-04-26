from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.incident import Incident
from app.models.ai_analysis import AIAnalysis
from app.schemas.alert_schema import AlertCreate
from app.schemas.incident_schema import IncidentResponse, IncidentUpdate
from app.services.email_service import send_email_notification
from app.services.ai_agent import analyze_incident

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/alerts")
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    incident = Incident(
        vendor=alert.vendor,
        environment=alert.environment,
        severity=alert.severity,
        error_code=alert.error_code,
        status="OPEN"
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Run AI first
    ai_result = analyze_incident(incident)

    # Save AI analysis
    analysis = AIAnalysis(
        incident_id=incident.id,
        root_cause=ai_result["root_cause"],
        confidence=ai_result["confidence"],
        recommendation=ai_result["recommendation"]
    )

    db.add(analysis)
    db.commit()

    # Send email WITH AI insights
    email_sent = send_email_notification(incident, ai_result)

    return {
        "message": "Alert received and incident created",
        "incident_id": incident.id,
        "email_sent": email_sent,
        "ai_analysis": ai_result
    }


@router.get("/incidents", response_model=list[IncidentResponse])
def get_incidents(
    status: str | None = Query(default=None),
    vendor: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    environment: str | None = Query(default=None),
    error_code: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
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

    incidents = (
        query
        .order_by(Incident.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return incidents


@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
def get_incident_by_id(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()

    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    return incident


@router.put("/incidents/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: int,
    incident_data: IncidentUpdate,
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()

    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

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

    db.commit()
    db.refresh(incident)

    return incident


@router.get("/incidents/{incident_id}/similar", response_model=list[IncidentResponse])
def get_similar_incidents(incident_id: int, db: Session = Depends(get_db)):
    current_incident = db.query(Incident).filter(Incident.id == incident_id).first()

    if current_incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    similar_incidents = (
        db.query(Incident)
        .filter(Incident.id != incident_id)
        .filter(Incident.vendor == current_incident.vendor)
        .filter(Incident.error_code == current_incident.error_code)
        .order_by(Incident.created_at.desc())
        .all()
    )

    return similar_incidents