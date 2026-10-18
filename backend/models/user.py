from sqlalchemy import JSON, Column, Integer, String, ARRAY
from database import Base

privileges_config = {
    "canCreateFrogs": True,
    "canEditFrogs": True,
    "canDeleteFrogs": True,
    "canGetUsers": True,
    "canEditUsers": True,
    "canDeleteUsers": True,
}

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    attributes = Column(JSON, default=lambda: {})
    organizations = Column(ARRAY(Integer), index=True)