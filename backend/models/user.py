from sqlalchemy import JSON, Column, Integer, String, ARRAY
from database import Base

privilegesConfig = {
    "canCreateFrogs": False,
    "canEditFrogs": False,
    "canDeleteFrogs": False,
    "canRetrainModel": False,
    "canGetUsers": False,
    "canEditUsers": False,
    "canDeleteUsers": False,
}

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, index=True)
    dict = Column(JSON, default=lambda: {})
    organizations = Column(ARRAY(Integer), index=True)

    # privileges = Column(JSON, default=lambda: privilegesConfig)