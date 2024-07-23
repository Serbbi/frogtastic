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


    # last_injection: Optional[date] = None
    # last_priming: Optional[date] = None
    # notes: Optional[str] = None
    # sex: Optional[str] = None
    # egg_quality: Optional[int] = None 
    # actual_tank_id: Optional[int] = None
    # is_sick: bool = False
    # is_laying_eggs: bool = False