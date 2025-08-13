from typing import Optional

from pydantic import BaseModel


class FrogBase(BaseModel):
    frog_number: int
    tank_id: int
    current_tank_id: Optional[int] = None
    attributes: dict
    organization_id: int
    history: dict
    image_path: str


class FrogResponse(FrogBase):
    id: int
    frog_number: int
    tank_id: int
    current_tank_id: Optional[int] = None
    attributes: dict
    organization_id: int
    history: dict
    image_path: str

    class Config:
        orm_mode = True
