# The router that is used from all "/users/*" endpoints.
from typing import Union
from fastapi import APIRouter, Depends
from crud.user import UserController
from util import util
from schemas.user import UserBase
from models.user import User
from util.exceptions import raise_400_exception, raise_403_exception

ACCESS_RIGHT_MESSAGE = "User does not have access right"
router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("")
async def get_users(
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if util.get_organization_access_right(str(org_q), "canGetUsers", current_user):
        return controller.get_users(org_q)
    raise_403_exception(ACCESS_RIGHT_MESSAGE)


@router.get("/{user_id}")
async def get_user(
    user_id: int, 
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if util.get_organization_access_right(str(org_q), "canGetUsers", current_user):
        return controller.get_user_by_id(user_id)
    raise_403_exception(ACCESS_RIGHT_MESSAGE)

@router.post("")
async def create_user(
    user: UserBase,
    controller: UserController = Depends(UserController)
):
    user_db = controller.get_user_by_username(user.username)
    if user_db:
        raise_400_exception("Username already registered")
    
    user_db = controller.get_user_by_email(user.email)
    if user_db:
        raise_400_exception("Email already registered")

    if controller.verify_email(user.email) is None:
        raise_400_exception("Email must be a 'rug.nl' email")
    
    user.hashed_password = util.get_password_hash(user.hashed_password)
    controller.create_user(user)
    return user


@router.put("/{user_id}")
async def update_user(
    user_id: int, 
    user: UserBase, 
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if util.get_organization_access_right(str(org_q), "canEditUsers", current_user):
        return controller.update_user(user_id, user)
    raise_403_exception(ACCESS_RIGHT_MESSAGE)


@router.delete("/{user_id}")
async def delete_user(
    user_id: int, 
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if util.get_organization_access_right(str(org_q), "canDeleteUsers", current_user):
        return controller.delete_user(user_id)
    raise_403_exception(ACCESS_RIGHT_MESSAGE)