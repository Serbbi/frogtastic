from sqlalchemy import Column, ForeignKey, Integer, JSON, String
from database import Base

class Frog(Base):
    __tablename__ = "frogs"

    id = Column(Integer, primary_key=True, index=True)
    frog_number = Column(Integer, index=True)
    tank_id = Column(Integer, index=True)
    current_tank_id = Column(Integer, ForeignKey('tanks.id'), index=True)
    attributes = Column(JSON, default=lambda: {})
    organization_id = Column(Integer, ForeignKey('organizations.id'), index=True)
    history = Column(JSON, default=lambda: {})
    image_path = Column(String, index=True)