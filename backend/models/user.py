from sqlalchemy import JSON, Column, Integer, String
from database import Base

privilegesConfig = {
    "canEditFrogs": False,
    "canRetrainModel": False,
    "canEditUsers": False,
}

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, index=True)
    privileges = Column(JSON, default=lambda: privilegesConfig)