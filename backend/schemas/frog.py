from datetime import date
from pydantic import BaseModel

class FrogBase(BaseModel):
    frog_number: int
    last_injection: date
    last_priming: date
    notes: str
    sex: str
    egg_quality: int
    tank_id: int
    actual_tank_id: int
    is_sick: bool = False
    is_laying_eggs: bool = False