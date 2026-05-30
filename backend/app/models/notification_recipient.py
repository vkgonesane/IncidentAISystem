from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String
)

import datetime

from app.database.db import Base


class NotificationRecipient(Base):
    __tablename__ = "notification_recipients"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    vendor = Column(
        String,
        nullable=False,
        index=True
    )

    email = Column(
        String,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )