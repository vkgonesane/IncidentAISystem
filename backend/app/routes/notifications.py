from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.notification_recipient import (
    NotificationRecipient
)

from app.schemas.notification_schema import (
    NotificationRecipientCreate,
    NotificationRecipientResponse,
    NotificationRecipientUpdate
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get(
    "/recipients",
    response_model=list[
        NotificationRecipientResponse
    ]
)
def get_recipients(
    db: Session = Depends(get_db)
):
    recipients = (
        db.query(NotificationRecipient)
        .order_by(
            NotificationRecipient.vendor
        )
        .all()
    )

    return recipients


@router.post(
    "/recipients",
    response_model=NotificationRecipientResponse
)
def create_recipient(
    payload: NotificationRecipientCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(NotificationRecipient)
        .filter(
            NotificationRecipient.vendor
            == payload.vendor,
            NotificationRecipient.email
            == payload.email
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail=(
                "Recipient already exists "
                "for this vendor"
            )
        )

    recipient = NotificationRecipient(
        vendor=payload.vendor,
        email=payload.email
    )

    db.add(recipient)

    db.commit()

    db.refresh(recipient)

    return recipient


@router.put(
    "/recipients/{recipient_id}",
    response_model=NotificationRecipientResponse
)
def update_recipient(
    recipient_id: int,
    payload: NotificationRecipientUpdate,
    db: Session = Depends(get_db)
):
    recipient = (
        db.query(NotificationRecipient)
        .filter(
            NotificationRecipient.id
            == recipient_id
        )
        .first()
    )

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Recipient not found"
        )

    recipient.is_active = payload.is_active

    db.commit()

    db.refresh(recipient)

    return recipient


@router.delete(
    "/recipients/{recipient_id}"
)
def delete_recipient(
    recipient_id: int,
    db: Session = Depends(get_db)
):
    recipient = (
        db.query(NotificationRecipient)
        .filter(
            NotificationRecipient.id
            == recipient_id
        )
        .first()
    )

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Recipient not found"
        )

    db.delete(recipient)

    db.commit()

    return {
        "message":
        "Recipient deleted successfully"
    }