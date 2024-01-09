# The router that will be used from all "/frogs/*" endpoints.
from fastapi import APIRouter, Depends, HTTPException
from crud.frog import FrogController
from crud.user import UserController
from schemas.frog import FrogBase
from typing_extensions import Annotated
from models.user import User
from util.util import get_current_user


router = APIRouter(
    prefix="/frogs",
    tags=["frogs"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

def get_access_right(privilege: str, current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.privileges[privilege] == True:
        return True
    return False

def get_create_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canEditFrogs", current_user)


@router.get("/{frog_id}")
async def get_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_frog(frog_id)

@router.post("")
async def create_frog(
    frog: FrogBase, 
    access_right: Annotated[User, Depends(get_create_frog_access_right)],
    controller: FrogController = Depends(FrogController)
):
    if access_right:
        return controller.create_frog(frog)
    raise HTTPException(status_code=400, detail="User does not have access right")

@router.get("/tank/{tank_id}")
async def get_tank_frogs(tank_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_tank_frogs(tank_id)

@router.put("/{frog_id}")
async def update_frog(frog_id: int, frog: FrogBase, controller: FrogController = Depends(FrogController)):
    return controller.update_frog(frog_id, frog)

@router.delete("/{frog_id}")
async def delete_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    return controller.delete_frog(frog_id)