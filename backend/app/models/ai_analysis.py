from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False, unique=True)
    root_cause = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    recommendation = Column(String, nullable=False)

    incident = relationship("Incident", back_populates="ai_analysis")