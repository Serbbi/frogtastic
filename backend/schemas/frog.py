from datetime import date
from pydantic import BaseModel
from typing import Optional

class FrogBase(BaseModel):
    frog_number: int
    tank_id: int
    current_tank_id: Optional[int] = None
    attributes: dict
    organization_id: int
    history: dict