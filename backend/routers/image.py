# The router that is used from all "/image/*" endpoints.
from fastapi import APIRouter, Depends, File, UploadFile
from crud.frog import FrogController
from util.exceptions import raise_404_exception, raise_409_exception
from typing import Union
import os
import shutil
import datetime

router = APIRouter(
    prefix="/image",
    tags=["image"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

images = {}

@router.post("/{organization_id}")
async def upload_image(organization_id: int, 
                       model_id: Union[int, None] = 1, 
                       file: UploadFile = File(..., size=10_000_000), controller: FrogController = Depends(FrogController)):
    frog_composition = controller.get_frog_by_image(file, organization_id, model_id)
    if frog_composition['frog']:
        file.file.seek(0)
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
        temp_file_path = f"/tmp/{frog_composition['frog'].id}_{timestamp}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        images[frog_composition['frog'].id] = temp_file_path
        return frog_composition
    
    raise_404_exception("Frog not found")

@router.put("/save")
async def save_image(decision: str,
                     frog_id: int,
                     controller: FrogController = Depends(FrogController)):
    if decision == "yes":
        if not images:
            raise_409_exception("No images to save")
        
        if frog_id not in images:
            raise_404_exception("Frog ID not found in images")

        temp_file_path = images.pop(frog_id)
        gcs_path = f"uploads/{frog_id}/{temp_file_path[5:]}"
        public_url = controller.upload_to_gcs(temp_file_path, gcs_path)
        os.remove(temp_file_path)
        return {"url": public_url}

    elif decision == "no":
        images.pop(frog_id, None)
        return {"message": "Image discarded"}