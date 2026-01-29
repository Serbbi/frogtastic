from pydantic import BaseModel
from typing import Optional

class FrogBase(BaseModel):
    frog_number: int
    tank_id: int
    current_tank_id: Optional[int] = None
    attributes: dict
    organization_id: int
    history: dict
    key_path: str


class FrogResponse(FrogBase):
    id: int
    frog_number: int
    tank_id: int
    current_tank_id: Optional[int] = None
    attributes: dict
    organization_id: int
    history: dict
    reference_image_url: str = ""
    image_history: Optional[list] = None #Temporary to work or maybe definitive will see

    class Config:
        orm_mode = True