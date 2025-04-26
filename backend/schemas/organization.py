from pydantic import BaseModel

class OrganizationBase(BaseModel):
    name: str
    participants: list
    admins: list
    table_columns: list
    system_parameter_names: list
    system_parameters: dict