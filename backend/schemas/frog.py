from datetime import date
from pydantic import BaseModel

class FrogBase(BaseModel):
    last_injection: date
    last_priming: date
    notes: str
    sex: str
    egg_quality: int
    tank_id: int
    actual_tank_id: int