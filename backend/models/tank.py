from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String


class Tank(Base):
    __tablename__ = "tanks"

    id = Column(Integer, primary_key=True, index=True)
    tank_name = Column(String, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), index=True)
