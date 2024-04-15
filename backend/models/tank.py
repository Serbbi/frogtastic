from sqlalchemy import Column, ForeignKey, Integer, ARRAY, JSON, String
from database import Base

class Tank(Base):
    __tablename__ = "tanks"

    id = Column(Integer, primary_key=True, index=True)
    tank_name = Column(String, index=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'), index=True)
    frog_ids = Column(ARRAY(Integer, ForeignKey('frogs.id')), index=True)
    dict = Column(JSON, default=lambda: {})