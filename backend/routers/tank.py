from fastapi import APIRouter, Depends
from crud.frog import FrogController

router = APIRouter(
    prefix="/tank",
    tags=["tank"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("/{tank_id}/frogs")
async def get_tank_frogs(tank_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_tank_frogs(tank_id)
