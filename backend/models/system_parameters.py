from sqlalchemy import JSON, Column, Integer, DateTime, func
from database import Base

class SystemParameters(Base):
    __tablename__ = "system_parameters"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, nullable=False, index=True)
    recorded_at = Column(DateTime, default=func.now(), index=True)
    values = Column(JSON, default=lambda: {})