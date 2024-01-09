from pydantic import BaseModel

privilegesConfig = {
    "canCreateFrogs": False,
    "canEditFrogs": False,
    "canDeleteFrogs": False,
    "canRetrainModel": False,
    "canEditUsers": False,
}

class UserBase(BaseModel):
    username: str
    hashed_password: str
    privileges: dict = privilegesConfig