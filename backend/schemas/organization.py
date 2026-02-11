from pydantic import BaseModel

class OrganizationBase(BaseModel):
    name: str
    participants: list
    admins: list
    table_columns: list
    system_parameter_names: list
    system_parameters: dict


class OrganizationResponse(OrganizationBase):
    id: int
    name: str
    participants: list
    admins: list
    table_columns: list
    system_parameter_names: list
    system_parameters: dict
    logo_url: str = ""

    class Config:
        orm_mode = True