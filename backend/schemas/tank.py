from pydantic import BaseModel


class TankBase(BaseModel):
    tank_name: str
    organization_id: int
