from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.db import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(
        Integer,
        ForeignKey("incidents.id"),
        nullable=False
    )

    root_cause = Column(String, nullable=False)

    confidence = Column(Float, nullable=False)

    recommendation = Column(String, nullable=False)

    summary = Column(Text, nullable=True)

    recurrence_insight = Column(Text, nullable=True)

    priority_reason = Column(Text, nullable=True)

    incident = relationship(
        "Incident",
        back_populates="ai_analysis"
    )