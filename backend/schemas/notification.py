from pydantic import BaseModel


class NotificationBase(BaseModel):
    title: str
    description: str
    organization_id: int
    user_id: int
