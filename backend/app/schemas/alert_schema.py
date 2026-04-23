from pydantic import BaseModel


class AlertCreate(BaseModel):
    vendor: str
    environment: str
    severity: str
    error_code: str