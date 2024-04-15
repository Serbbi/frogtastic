from sqlalchemy import Column, ForeignKey, Integer, String, ARRAY
from database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    participants = Column(ARRAY(Integer, ForeignKey('users.id')), index=True)

