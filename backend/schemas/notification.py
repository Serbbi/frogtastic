from pydantic import BaseModel

class NotificationBase(BaseModel):
    title: str
    description: str
    organization_name: str
    user_id: int