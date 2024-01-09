# The router that is used from all "/users/*" endpoints.
from fastapi import APIRouter, Depends, HTTPException
from crud.user import UserController
from util import util
from util.userUtil import get_get_user_access_right, get_create_user_access_right, get_edit_user_access_right, get_delete_user_access_right
from schemas.user import UserBase


router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("")
async def get_users(
    access_right: bool = Depends(get_get_user_access_right),
    controller: UserController = Depends(UserController)
):
    if access_right:
        return controller.get_users()
    raise HTTPException(status_code=400, detail="User does not have access right")


@router.get("/{user_id}")
async def get_user(
    user_id: int, 
    access_right: bool = Depends(get_get_user_access_right),
    controller: UserController = Depends(UserController)
):
    if access_right:
        return controller.get_user_by_id(user_id)
    raise HTTPException(status_code=400, detail="User does not have access right")

@router.post("")
async def create_user(
    user: UserBase, 
    access_right: bool = Depends(get_create_user_access_right),
    controller: UserController = Depends(UserController)
):
    if not access_right:
        raise HTTPException(status_code=400, detail="User does not have access right")
    
    user_db = controller.get_user_by_username(user.username)
    if user_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user.hashed_password = util.get_password_hash(user.hashed_password)
    controller.create_user(user)
    return user


@router.put("/{user_id}")
async def update_user(
    user_id: int, 
    user: UserBase, 
    access_right: bool = Depends(get_edit_user_access_right),
    controller: UserController = Depends(UserController)
):
    if access_right:
        return controller.update_user(user_id, user)
    raise HTTPException(status_code=400, detail="User does not have access right")


@router.delete("/{user_id}")
async def delete_user(
    user_id: int, 
    access_right: bool = Depends(get_delete_user_access_right),
    controller: UserController = Depends(UserController)
):
    if access_right:
        return controller.delete_user(user_id)
    raise HTTPException(status_code=400, detail="User does not have access right")