from typing import List, Union

from crud.tank import TankController
from fastapi import APIRouter, Depends
from schemas.tank import TankBase

router = APIRouter(
    prefix="/tanks",
    tags=["tanks"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
        422: {
            "description": "The request was well-formed but was unable to be followed due to semantic errors"
        },
    },
)


@router.get("")
async def get_tanks(
    org_q: Union[int, None] = None, controller: TankController = Depends(TankController)
):
    return controller.get_tanks(org_q)


@router.get("/{tank_id}")
async def get_tank(tank_id: int, controller: TankController = Depends(TankController)):
    return controller.get_tank(tank_id)


@router.post("")
async def create_tank(
    tank: TankBase, controller: TankController = Depends(TankController)
):
    return controller.create_tank(tank)


@router.put("/{tank_id}")
async def update_tank(
    tank_id: int, tank: TankBase, controller: TankController = Depends(TankController)
):
    return controller.update_tank(tank_id, tank)


@router.delete("/{tank_id}")
async def delete_tank(
    tank_id: int, controller: TankController = Depends(TankController)
):
    return controller.delete_tank(tank_id)


@router.post("/{organization_id}/attributes")
async def create_tank_attributes(
    organization_id: int,
    attributes: List[str],
    controller: TankController = Depends(TankController),
):
    return controller.create_tank_attributes(organization_id, attributes)


@router.delete("/{organization_id}/attributes")
async def delete_tank_attributes(
    organization_id: int,
    attributes: List[str],
    controller: TankController = Depends(TankController),
):
    return controller.delete_tank_attributes(organization_id, attributes)
