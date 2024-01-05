from pydantic import BaseModel

class FrogBase(BaseModel):
    name: str
    age: int
    tank_id: int