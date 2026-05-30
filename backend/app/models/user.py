from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    role = Column(String(30), nullable=False, default="VIEWER")
    is_active = Column(String(10), nullable=False, default="true")

    created_at = Column(DateTime(timezone=True), server_default=func.now())