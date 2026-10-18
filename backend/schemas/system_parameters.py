from pydantic import BaseModel

class SystemParametersBase(BaseModel):
    organization_id: int
    values: dict
    recorded_at: str

class SystemParametersRequest(SystemParametersBase):
    id: int
    organization_id: int
    values: dict
    recorded_at: str

    class Config:
        orm_mode = True