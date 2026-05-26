from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.orm import relationship
import datetime

from app.database.db import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    vendor = Column(String, nullable=False)
    environment = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    error_code = Column(String, nullable=False)

    status = Column(String, default="OPEN")
    assignee = Column(String, nullable=True)

    source_type = Column(String, default="MANUAL")
    source_name = Column(String, default="frontend")

    raw_payload = Column(Text, nullable=True)

    records_impacted = Column(Integer, default=0)
    amount_impacted = Column(Float, default=0.0)
    ack_delay_minutes = Column(Integer, default=0)

    sla_minutes = Column(Integer, default=30)
    sla_status = Column(String, default="WITHIN")
    is_anomaly = Column(Boolean, default=False)

    duplicate_count = Column(Integer, default=1)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    last_seen_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    ai_analysis = relationship(
        "AIAnalysis",
        back_populates="incident",
        uselist=False
    )

    updates = relationship(
        "IncidentUpdate",
        back_populates="incident",
        cascade="all, delete-orphan"
    )