from pydantic import BaseModel
from typing import Optional


class AlertCreate(BaseModel):
    vendor: str
    environment: str
    severity: str
    error_code: str

    source_type: Optional[str] = "MANUAL"
    source_name: Optional[str] = "frontend"
    raw_payload: Optional[str] = None

    records_impacted: Optional[int] = 0
    amount_impacted: Optional[float] = 0.0
    ack_delay_minutes: Optional[int] = 0
    sla_minutes: Optional[int] = 30