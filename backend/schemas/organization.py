from pydantic import BaseModel

class OrganizationBase(BaseModel):
    name: str
    participants: list
    admins: list