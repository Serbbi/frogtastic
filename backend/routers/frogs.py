# The router that is used from all "/frogs/*" endpoints.
from fastapi import APIRouter, Depends
from crud.frog import FrogController
from schemas.frog import FrogBase
from util.frogUtil import get_create_frog_access_right, get_edit_frog_access_right, get_delete_frog_access_right
from util.exceptions import raise_access_right_exception

router = APIRouter(
    prefix="/frogs",
    tags=["frogs"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("")
async def get_frogs(controller: FrogController = Depends(FrogController)):
    return controller.get_frogs()

@router.get("/{frog_id}")
async def get_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_frog(frog_id)


@router.post("")
async def create_frog(
    frog: FrogBase, 
    access_right: bool = Depends(get_create_frog_access_right),
    controller: FrogController = Depends(FrogController)
):
    if access_right:
        return controller.create_frog(frog)
    raise_access_right_exception()

@router.get("/tank/{tank_id}")
async def get_tank_frogs(tank_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_tank_frogs(tank_id)


@router.put("/{frog_id}")
async def update_frog(
    frog_id: int, 
    frog: FrogBase, 
    access_right: bool = Depends(get_edit_frog_access_right),
    controller: FrogController = Depends(FrogController)
):
    if access_right:
        return controller.update_frog(frog_id, frog)
    raise_access_right_exception()

@router.delete("/{frog_id}")
async def delete_frog(
    frog_id: int, 
    access_right: bool = Depends(get_delete_frog_access_right),
    controller: FrogController = Depends(FrogController)
):
    if access_right:
        return controller.delete_frog(frog_id)
    raise_access_right_exception()