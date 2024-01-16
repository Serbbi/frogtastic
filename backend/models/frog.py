from sqlalchemy import Column, Integer, String, Date
from database import Base

class Frog(Base):
    __tablename__ = "frogs"

    id = Column(Integer, primary_key=True, index=True)
    last_injection = Column(Date, index=True)
    last_priming = Column(Date, index=True)
    notes = Column(String, index=True)
    sex = Column(String, index=True)
    egg_quality = Column(Integer, index=True)
    tank_id = Column(Integer, index=True)
    actual_tank_id = Column(Integer, index=True)