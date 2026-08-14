# The router that is used from all "/frogs/*" endpoints.
from util.permissions import Permission
from util.loaders import load_frog, load_frogs
from fastapi import APIRouter, Depends
from models.user import User
from crud.frog import FrogController
from schemas.frog import FrogBase, FrogResponse
from models.frog import Frog
from util import util
from typing import List, Union

router = APIRouter(
    prefix="/frogs",
    tags=["frogs"],
    responses={
        404: {"description": "Not found"},
        401: {"description": "Token has expired"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("")
async def get_frogs(org_q: Union[int, None] = None, 
                    tank_q: Union[int, None] = None,
                    no_frogs_q: Union[int, None] = None, 
                    controller: FrogController = Depends(FrogController),
                    _: str = Depends(util.verify_token)):
    return controller.get_frogs(org_q, tank_q, no_frogs_q)


@router.get("/download-csv")
async def download_csv(org_q: Union[int, None],
                       tank_q: Union[int, None] = None,
                       controller: FrogController = Depends(FrogController),
                       _: str = Depends(util.verify_token)):
    return controller.download_csv(org_q, tank_q)


@router.get("/{frog_id}", response_model=FrogResponse)
async def get_frog(frog_id: int, 
                   controller: FrogController = Depends(FrogController),
                   _: str = Depends(util.verify_token)):
    return controller.get_frog(frog_id)


@router.put("")
async def update_frogs(org_q: int, 
                       attributes: List[str],
                       frogs: List[Frog] = Depends(util.require_list_resource_permission(load_frogs, Permission.EDIT_FROGS)),
                       controller: FrogController = Depends(FrogController),
                       _: str = Depends(util.verify_token)):
    return controller.update_frogs(attributes, org_q)


@router.put("/{frog_id}", response_model=FrogResponse)
async def update_frog(
    frog: FrogBase,
    frog_checked: Frog = Depends(util.require_resource_permission(load_frog, Permission.EDIT_FROGS)),
    current_user: User = Depends(util.get_current_user),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token)
):
    return controller.update_frog(frog_checked.id, frog, current_user.username)
    

@router.delete("/{frog_id}")
async def delete_frog(
    frog_checked: Frog = Depends(util.require_resource_permission(load_frog, Permission.DELETE_FROGS)),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token)
):
    return controller.delete_frog(frog_checked.id)


@router.post("/instantiate-frogs")
async def instantiate_frogs(
    org_q: int,
    current_user: User = Depends(util.require_simple_permission(Permission.CREATE_FROGS)),
    controller: FrogController = Depends(FrogController),
):
    return controller.instantiate_frogs(org_q)