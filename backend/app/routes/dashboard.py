from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.incident import Incident

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_incidents = db.query(Incident).count()

    open_incidents = (
        db.query(Incident)
        .filter(Incident.status == "OPEN")
        .count()
    )

    critical_incidents = (
        db.query(Incident)
        .filter(Incident.severity == "CRITICAL")
        .count()
    )

    sla_breached = (
        db.query(Incident)
        .filter(Incident.sla_status == "BREACHED")
        .count()
    )

    anomalies_detected = (
        db.query(Incident)
        .filter(Incident.is_anomaly == True)
        .count()
    )

    total_amount_impacted = (
        db.query(func.coalesce(func.sum(Incident.amount_impacted), 0))
        .scalar()
    )

    average_ack_delay = (
        db.query(func.coalesce(func.avg(Incident.ack_delay_minutes), 0))
        .scalar()
    )

    return {
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "critical_incidents": critical_incidents,
        "sla_breached": sla_breached,
        "anomalies_detected": anomalies_detected,
        "total_amount_impacted": float(total_amount_impacted),
        "average_ack_delay": round(float(average_ack_delay), 2),
    }


@router.get("/incidents/trend")
def get_incident_trend(db: Session = Depends(get_db)):
    today = date.today()
    start_date = today - timedelta(days=6)

    rows = (
        db.query(
            func.date(Incident.created_at).label("incident_date"),
            func.count(Incident.id).label("count"),
        )
        .filter(Incident.created_at >= datetime.combine(start_date, datetime.min.time()))
        .group_by(func.date(Incident.created_at))
        .order_by(func.date(Incident.created_at))
        .all()
    )

    count_by_date = {
        str(row.incident_date): row.count
        for row in rows
    }

    trend = []

    for index in range(7):
        current_date = start_date + timedelta(days=index)
        current_date_str = current_date.isoformat()

        trend.append({
            "date": current_date_str,
            "count": count_by_date.get(current_date_str, 0),
        })

    return trend


@router.get("/alerts/sources")
def get_alert_sources(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Incident.source_type.label("source_type"),
            func.count(Incident.id).label("count"),
        )
        .group_by(Incident.source_type)
        .order_by(func.count(Incident.id).desc())
        .all()
    )

    return [
        {
            "source_type": row.source_type or "UNKNOWN",
            "count": row.count,
        }
        for row in rows
    ]