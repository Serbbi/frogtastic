# The router that is used from all "/frogs/*" endpoints.
from typing import List, Union

from crud.frog import FrogController
from fastapi import APIRouter, Depends, File, UploadFile
from models.user import User
from schemas.frog import FrogBase
from util import util
from util.exceptions import raise_403_exception

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
async def get_frogs(
    org_q: Union[int, None] = None,
    tank_q: Union[int, None] = None,
    no_frogs_q: Union[int, None] = None,
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    return controller.get_frogs(org_q, tank_q, no_frogs_q)


@router.get("/change")
async def change_frog(controller: FrogController = Depends(FrogController)):
    return controller.change_frog_history_format()


@router.get("/download-csv")
async def download_csv(
    org_q: Union[int, None],
    tank_q: Union[int, None] = None,
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    return controller.download_csv(org_q, tank_q)


@router.get("/{frog_id}")
async def get_frog(
    frog_id: int,
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    return controller.get_frog(frog_id)


@router.put("")
async def update_frogs(
    org_q: int,
    attributes: List[str],
    current_user: User = Depends(util.get_current_user),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    if util.get_organization_access_right(str(org_q), "canEditFrogs", current_user):
        return controller.update_frogs(attributes, org_q)
    raise_403_exception("You cannot edit these frogs")


@router.put("/{frog_id}")
async def update_frog(
    frog_id: int,
    frog: FrogBase,
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    if util.get_organization_access_right(str(org_q), "canEditFrogs", current_user):
        return controller.update_frog(frog_id, frog, current_user.username, str(org_q))

    raise_403_exception("You cannot edit this frog")


@router.delete("/{frog_id}")
async def delete_frog(
    frog_id: int,
    org_q: Union[int, None] = None,
    current_user: User = Depends(util.get_current_user),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    if util.get_organization_access_right(str(org_q), "canDeleteFrogs", current_user):
        return controller.delete_frog(frog_id, str(org_q))
    raise_403_exception("You cannot delete this frog")


@router.post("/train")
async def train_model(
    file: UploadFile = File(...),
    controller: FrogController = Depends(FrogController),
    _: str = Depends(util.verify_token),
):
    return controller.train_model(file)
