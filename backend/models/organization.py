from database import Base
from sqlalchemy import ARRAY, JSON, Column, ForeignKey, Integer, String


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    participants = Column(ARRAY(Integer, ForeignKey("users.id")), index=True)
    admins = Column(ARRAY(Integer, ForeignKey("users.id")), index=True)
    table_columns = Column(ARRAY(String), index=True)
    system_parameter_names = Column(ARRAY(String), index=True)
    system_parameters = Column(JSON, default=lambda: {})
