import json
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.routes.alerts import create_alert
from app.schemas.alert_schema import AlertCreate

router = APIRouter()


class MonitoringWebhookPayload(BaseModel):
    source: Optional[str] = "MONITORING_WEBHOOK"
    vendor: str
    environment: str
    severity: str
    error_code: str
    system_name: Optional[str] = "UNKNOWN_SYSTEM"
    message: Optional[str] = None
    records_impacted: Optional[int] = 0
    amount_impacted: Optional[float] = 0.0
    ack_delay_minutes: Optional[int] = 0
    sla_minutes: Optional[int] = 30
    raw: Optional[Dict[str, Any]] = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/monitoring/webhook")
async def ingest_monitoring_webhook(
    payload: MonitoringWebhookPayload,
    db: Session = Depends(get_db),
):
    raw_payload = {
        "source": payload.source,
        "vendor": payload.vendor,
        "environment": payload.environment,
        "severity": payload.severity,
        "error_code": payload.error_code,
        "system_name": payload.system_name,
        "message": payload.message,
        "records_impacted": payload.records_impacted,
        "amount_impacted": payload.amount_impacted,
        "ack_delay_minutes": payload.ack_delay_minutes,
        "sla_minutes": payload.sla_minutes,
        "raw": payload.raw or {},
    }

    alert = AlertCreate(
        vendor=payload.vendor,
        environment=payload.environment,
        severity=payload.severity,
        error_code=payload.error_code,
        source_type="MONITORING_WEBHOOK",
        source_name=payload.source or payload.system_name or "UNKNOWN_SOURCE",
        raw_payload=json.dumps(raw_payload),
        records_impacted=payload.records_impacted or 0,
        amount_impacted=payload.amount_impacted or 0.0,
        ack_delay_minutes=payload.ack_delay_minutes or 0,
        sla_minutes=payload.sla_minutes or 30,
    )

    return await create_alert(alert=alert, db=db)