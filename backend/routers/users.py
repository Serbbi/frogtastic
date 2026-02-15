# The router that is used from all "/users/*" endpoints.
from util.permissions import Permission
from util.loaders import load_user, load_users
from fastapi import APIRouter, Depends, File, UploadFile
from crud.user import UserController
from typing import List
from util import util
from schemas.user import UserBase, UserResponse
from models.user import User
from util.exceptions import raise_400_exception, raise_403_exception

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("")
async def get_users(
    users: List[User] = Depends(util.require_list_resource_permission(load_users, Permission.GET_USERS)),
    controller: UserController = Depends(UserController),
):
    return [controller.build_user_response(user) for user in users]


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    return controller.build_user_response(current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_checked: User = Depends(util.require_resource_permission(load_user, Permission.GET_USERS)),
    controller: UserController = Depends(UserController)
):
    return controller.build_user_response(user_checked)


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

    # if controller.verify_email(user.email) is None:
        # raise_400_exception("Email must be a 'rug.nl' email")
    
    user.hashed_password = util.get_password_hash(user.hashed_password)
    controller.create_user(user)
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_base: UserBase, 
    user_checked: User = Depends(util.require_resource_permission(load_user, Permission.EDIT_USERS)),
    controller: UserController = Depends(UserController)
):
    updated_user = controller.update_user(user_checked.id, user_base)
    return controller.build_user_response(updated_user)


@router.put("/{user_id}/profile-pic")
async def update_profile_pic(
    user_id: int, 
    file: UploadFile = File(..., size=10_000_000),
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if current_user.id == user_id:
        return await controller.update_profile_pic(user_id, file)
    raise_403_exception("User can only update their own profile picture")


@router.patch("/{user_id}")
async def update_user(
    user_id: int, 
    user: UserBase, 
    current_user: User = Depends(util.get_current_user),
    controller: UserController = Depends(UserController)
):
    if current_user.id == user_id:
        updated_user = controller.update_user(user_id, user)
        return controller.build_user_response(updated_user)
    raise_403_exception("User can only update themselves")


@router.delete("/{user_id}")
async def delete_user(
    user_checked: User = Depends(util.require_resource_permission(load_user, Permission.DELETE_USERS)),
    controller: UserController = Depends(UserController)
):
    return controller.delete_user(user_checked.id)
