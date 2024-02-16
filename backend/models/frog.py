from sqlalchemy import Column, Integer, String, Date, Boolean
from database import Base

class Frog(Base):
    __tablename__ = "frogs"

    id = Column(Integer, primary_key=True, index=True)
    frog_number = Column(Integer, index=True)
    last_injection = Column(Date, index=True, nullable=True)
    last_priming = Column(Date, index=True, nullable=True)
    notes = Column(String, index=True, nullable=True)
    sex = Column(String, index=True, nullable=True)
    egg_quality = Column(Integer, index=True, nullable=True)
    tank_id = Column(Integer, index=True)
    actual_tank_id = Column(Integer, index=True, nullable=True)
    is_sick = Column(Boolean, index=True)
    is_laying_eggs = Column(Boolean, index=True)