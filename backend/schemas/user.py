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
    email: str
    attributes: dict
    organizations: list


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    profile_picture_url: str = ""

    class Config:
        orm_mode = True