# The router that is used from all "/image/*" endpoints.
from fastapi import APIRouter, Depends, File, UploadFile
from crud.frog import FrogController
from util.exceptions import raise_404_exception

router = APIRouter(
    prefix="/image",
    tags=["image"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.post("/{organization_id}")
async def upload_image(organization_id: int, file: UploadFile = File(...), controller: FrogController = Depends(FrogController)):
    db_frog = controller.get_frog_by_image(file, organization_id)

    if db_frog:
        return db_frog
    
    raise_404_exception("Frog not found")
