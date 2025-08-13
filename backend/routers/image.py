# The router that is used from all "/image/*" endpoints.
from fastapi import APIRouter, Depends, File, UploadFile
from crud.frog import FrogController
from util.exceptions import raise_404_exception
from typing import Union

router = APIRouter(
    prefix="/image",
    tags=["image"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

images = []


@router.post("/{organization_id}")
async def upload_image(
    organization_id: int,
    model_id: Union[int, None] = 1,
    file: UploadFile = File(..., size=10_000_000),
    controller: FrogController = Depends(FrogController),
):
    db_frog = controller.get_frog_by_image(file, organization_id, model_id)
    if db_frog:
        images.append(file)
        return db_frog

    raise_404_exception("Frog not found")
