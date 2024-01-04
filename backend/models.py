from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base

class Frog(Base):
    __tablename__ = "frogs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    age = Column(Integer, index=True)
    tank_id = Column(Integer, ForeignKey("tanks.id"))

class Tank(Base):
    __tablename__ = "tanks"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, index=True)

