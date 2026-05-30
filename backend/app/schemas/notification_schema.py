from datetime import datetime

from pydantic import BaseModel, EmailStr


class NotificationRecipientCreate(
    BaseModel
):
    vendor: str
    email: EmailStr


class NotificationRecipientUpdate(
    BaseModel
):
    is_active: bool


class NotificationRecipientResponse(
    BaseModel
):
    id: int
    vendor: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True