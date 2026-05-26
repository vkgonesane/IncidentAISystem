from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class IncidentUpdate(BaseModel):
    vendor: Optional[str] = None
    environment: Optional[str] = None
    severity: Optional[str] = None
    error_code: Optional[str] = None
    status: Optional[str] = None
    assignee: Optional[str] = None


class AIAnalysisResponse(BaseModel):
    id: int
    incident_id: int
    root_cause: str
    confidence: float
    recommendation: str
    summary: Optional[str] = None
    recurrence_insight: Optional[str] = None
    priority_reason: Optional[str] = None

    class Config:
        from_attributes = True


class IncidentResponse(BaseModel):
    id: int
    vendor: str
    environment: str
    severity: str
    error_code: str
    status: str

    assignee: Optional[str] = None

    source_type: str
    source_name: str
    raw_payload: Optional[str] = None

    records_impacted: int
    amount_impacted: float
    ack_delay_minutes: int

    sla_minutes: int
    sla_status: str
    is_anomaly: bool

    created_at: datetime
    duplicate_count: int
    last_seen_at: datetime

    ai_analysis: Optional[AIAnalysisResponse] = None

    class Config:
        from_attributes = True