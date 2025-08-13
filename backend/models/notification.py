from sqlalchemy import Column, ForeignKey, Integer, String
from database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
