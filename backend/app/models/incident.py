from sqlalchemy import Column, Integer, String, DateTime
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
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ai_analysis = relationship("AIAnalysis", back_populates="incident", uselist=False)