from pydantic import BaseModel

privilegesConfig = {
    "canCreateFrogs": False,
    "canEditFrogs": False,
    "canDeleteFrogs": False,
    "canRetrainModel": False,
    "canGetUsers": False,
    "canEditUsers": False,
    "canDeleteUsers": False,
}

class UserBase(BaseModel):
    username: str
    hashed_password: str
    attributes: dict
    organizations: list