from pydantic import BaseModel
from datetime import datetime


class AIAnalysisResponse(BaseModel):
    root_cause: str
    confidence: float
    recommendation: str

    class Config:
        from_attributes = True


class IncidentResponse(BaseModel):
    id: int
    vendor: str
    environment: str
    severity: str
    error_code: str
    status: str
    created_at: datetime
    ai_analysis: AIAnalysisResponse | None = None

    class Config:
        from_attributes = True


class IncidentUpdate(BaseModel):
    vendor: str | None = None
    environment: str | None = None
    severity: str | None = None
    error_code: str | None = None
    status: str | None = None