from pydantic import BaseModel
from datetime import datetime


class IncidentUpdateResponse(BaseModel):
    id: int
    incident_id: int
    update_type: str
    message: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True