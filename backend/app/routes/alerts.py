import datetime
import json
import random

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.ai_analysis import AIAnalysis
from app.models.incident import Incident
from app.models.incident_update import IncidentUpdate
from app.models.user import User
from app.schemas.alert_schema import AlertCreate
from app.services.ai_agent import analyze_incident
from app.services.anomaly_service import is_anomaly_alert
from app.services.email_service import send_email_notification
from app.services.sla_service import get_sla_status
from app.services.websocket_manager import websocket_manager
from app.utils.auth_dependencies import require_roles

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


def format_ai_analysis(analysis: AIAnalysis | None):
    if analysis is None:
        return None

    return {
        "root_cause": analysis.root_cause,
        "confidence": analysis.confidence,
        "recommendation": analysis.recommendation,
        "summary": analysis.summary,
        "recurrence_insight": analysis.recurrence_insight,
        "priority_reason": analysis.priority_reason,
    }


@router.post("/alerts")
async def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
):
    existing_incident = (
        db.query(Incident)
        .filter(Incident.vendor == alert.vendor)
        .filter(Incident.environment == alert.environment)
        .filter(Incident.error_code == alert.error_code)
        .filter(Incident.status == "OPEN")
        .first()
    )

    if existing_incident:
        existing_incident.duplicate_count += 1
        existing_incident.last_seen_at = datetime.datetime.utcnow()

        add_incident_update(
            db=db,
            incident_id=existing_incident.id,
            update_type="DUPLICATE_DETECTED",
            message=(
                f"Duplicate alert detected from "
                f"{alert.source_type}/{alert.source_name}. "
                f"Duplicate count increased to {existing_incident.duplicate_count}."
            ),
            created_by="SYSTEM",
        )

        db.commit()
        db.refresh(existing_incident)

        await websocket_manager.broadcast(
            {
                "type": "DUPLICATE_ALERT",
                "incident_id": existing_incident.id,
                "duplicate_count": existing_incident.duplicate_count,
                "message": "Duplicate alert detected",
            }
        )

        return {
            "message": "Duplicate incident detected",
            "incident_id": existing_incident.id,
            "duplicate_count": existing_incident.duplicate_count,
            "ai_analysis": format_ai_analysis(existing_incident.ai_analysis),
        }

    incident = Incident(
        vendor=alert.vendor,
        environment=alert.environment,
        severity=alert.severity,
        error_code=alert.error_code,
        status="OPEN",
        source_type=alert.source_type,
        source_name=alert.source_name,
        raw_payload=alert.raw_payload,
        records_impacted=alert.records_impacted or 0,
        amount_impacted=alert.amount_impacted or 0.0,
        ack_delay_minutes=alert.ack_delay_minutes or 0,
        sla_minutes=alert.sla_minutes or 30,
        sla_status=get_sla_status(
            alert.ack_delay_minutes or 0,
            alert.sla_minutes or 30,
        ),
        is_anomaly=is_anomaly_alert(db, alert),
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    add_incident_update(
        db=db,
        incident_id=incident.id,
        update_type="CREATED",
        message=(
            f"Incident created from {incident.source_type}/{incident.source_name} "
            f"for {incident.vendor} in {incident.environment}."
        ),
        created_by="SYSTEM",
    )

    ai_result = analyze_incident(incident, db)

    analysis = AIAnalysis(
        incident_id=incident.id,
        root_cause=ai_result["root_cause"],
        confidence=ai_result["confidence"],
        recommendation=ai_result["recommendation"],
        summary=ai_result["summary"],
        recurrence_insight=ai_result["recurrence_insight"],
        priority_reason=ai_result["priority_reason"],
    )

    db.add(analysis)

    add_incident_update(
        db=db,
        incident_id=incident.id,
        update_type="AI_ANALYSIS",
        message=(
            f"AI analysis completed. "
            f"Root cause: {ai_result['root_cause']}. "
            f"Confidence: {ai_result['confidence']}."
        ),
        created_by="AI_AGENT",
    )

    email_sent = send_email_notification(incident, ai_result)

    if email_sent:
        add_incident_update(
            db=db,
            incident_id=incident.id,
            update_type="EMAIL_SENT",
            message="Email notification sent successfully.",
            created_by="SYSTEM",
        )
    else:
        add_incident_update(
            db=db,
            incident_id=incident.id,
            update_type="EMAIL_FAILED",
            message="Email notification failed or email configuration was missing.",
            created_by="SYSTEM",
        )

    db.commit()
    db.refresh(incident)

    await websocket_manager.broadcast(
        {
            "type": "INCIDENT_CREATED",
            "incident_id": incident.id,
            "severity": incident.severity,
            "vendor": incident.vendor,
            "environment": incident.environment,
            "error_code": incident.error_code,
            "sla_status": incident.sla_status,
            "is_anomaly": incident.is_anomaly,
            "message": "New incident created",
        }
    )

    return {
        "message": "Alert received and incident created",
        "incident_id": incident.id,
        "email_sent": email_sent,
        "sla_status": incident.sla_status,
        "is_anomaly": incident.is_anomaly,
        "ai_analysis": ai_result,
    }


@router.post("/alerts/simulate")
async def simulate_alert(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["ADMIN", "OPERATOR"])
    ),
):
    vendors = ["Pfizer", "Cigna", "UnitedHealth", "Aetna", "Humana"]

    systems = [
        "ACH_OUTBOUND_JOB",
        "PAYMENT_FILE_TRANSFER",
        "VENDOR_ACK_LISTENER",
        "RECONCILIATION_BATCH",
    ]

    error_codes = [
        "ACK_TIMEOUT",
        "SLA_BREACH",
        "FILE_MISMATCH",
        "PAYMENT_DELAY",
    ]

    severities = ["MEDIUM", "HIGH", "CRITICAL"]
    environments = ["TEST", "PROD"]

    vendor = random.choice(vendors)
    system_name = random.choice(systems)
    error_code = random.choice(error_codes)
    severity = random.choice(severities)
    environment = random.choice(environments)

    ack_delay_minutes = random.choice([12, 24, 31, 45, 62, 90])
    sla_minutes = 30

    records_impacted = random.choice([250, 1200, 5000, 12000, 25000])
    amount_impacted = random.choice(
        [50000, 250000, 750000, 2500000, 7000000]
    )

    simulated_payload = {
        "source": "SIMULATED_AIOPS_ALERT",
        "vendor": vendor,
        "system": system_name,
        "error_code": error_code,
        "severity": severity,
        "environment": environment,
        "ack_delay_minutes": ack_delay_minutes,
        "records_impacted": records_impacted,
        "amount_impacted": amount_impacted,
        "message": (
            f"{error_code} detected for {vendor} "
            f"on {system_name} in {environment}."
        ),
    }

    alert = AlertCreate(
        vendor=vendor,
        environment=environment,
        severity=severity,
        error_code=error_code,
        source_type="SIMULATED_API",
        source_name=system_name,
        raw_payload=json.dumps(simulated_payload),
        records_impacted=records_impacted,
        amount_impacted=amount_impacted,
        ack_delay_minutes=ack_delay_minutes,
        sla_minutes=sla_minutes,
    )

    return await create_alert(alert=alert, db=db)