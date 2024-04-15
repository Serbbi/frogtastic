from sqlalchemy import Column, ForeignKey, Integer, JSON
from database import Base

class Frog(Base):
    __tablename__ = "frogs"

    id = Column(Integer, primary_key=True, index=True)
    frog_number = Column(Integer, index=True)
    tank_id = Column(Integer, index=True)
    current_tank_id = Column(Integer, ForeignKey('tanks.id'), index=True)
    dict = Column(JSON, default=lambda: {})
    organization_id = Column(Integer, ForeignKey('organizations.id'), index=True)

    # last_injection = Column(Date, index=True, nullable=True)
    # last_priming = Column(Date, index=True, nullable=True)
    # notes = Column(String, index=True, nullable=True)
    # sex = Column(String, index=True, nullable=True)
    # egg_quality = Column(Integer, index=True, nullable=True)
    # is_sick = Column(Boolean, index=True)
    # is_laying_eggs = Column(Boolean, index=True)