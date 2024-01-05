# The router that will be used from all "/frogs/*" endpoints.
from fastapi import APIRouter, Depends
from crud.frog import FrogController
from schemas.frog import FrogBase

router = APIRouter(
    prefix="/frogs",
    tags=["frogs"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("/{frog_id}")
async def get_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_frog(frog_id)

@router.post("")
async def create_frog(frog: FrogBase, controller: FrogController = Depends(FrogController)):
    return controller.create_frog(frog)