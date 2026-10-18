# The router that is used from all "/image/*" endpoints.
from fastapi import APIRouter, Depends, File, UploadFile
from crud.frog import FrogController
from crud.image import ImageController
from models.user import User
from util.exceptions import raise_404_exception, raise_409_exception, raise_422_exception
from util.permissions import Permission
from util import util
from typing import Union
import os
import shutil
import datetime
from storage import s3, BUCKET_NAME

router = APIRouter(
    prefix="/image",
    tags=["image"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

images = {}


@router.post("/upload-reference")
async def upload_reference_image(org_q: int,
                                 frog_number: Union[int, None] = None,
                                 tank_number: Union[int, None] = None,
                                 file: UploadFile = File(...),
                                 user_checked: User = Depends(util.require_simple_permission(Permission.EDIT_FROGS)),
                                 controller: ImageController = Depends(ImageController)):
    return await controller.upload_reference_image(org_q, frog_number, tank_number, file)


@router.post("/bulk-upload-reference")
def bulk_upload_reference_images(org_q: int, 
                                 file: UploadFile = File(...),
                                 user_checked: User = Depends(util.require_simple_permission(Permission.EDIT_FROGS)),
                                 controller: ImageController = Depends(ImageController)):
    return controller.bulk_upload_reference_images(org_q, file)


@router.post("/{organization_id}")
async def upload_image(organization_id: int, 
                       model_name: str, 
                       file: UploadFile = File(..., size=10_000_000),
                       controller: FrogController = Depends(FrogController)):
    frog_composition = controller.get_frog_by_image(file, organization_id, model_name)
    if not frog_composition or 'frog' not in frog_composition:
        raise_422_exception("Could not extract frog from image")
    if frog_composition['frog']:
        file.file.seek(0)
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
        temp_file_path = f"/tmp/{frog_composition['frog'].id}_{timestamp}.{file.content_type.split('/')[-1]}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        images[frog_composition['frog'].id] = temp_file_path
        return frog_composition
    
    raise_404_exception("Frog not found")


@router.get("/image-url/{key:path}")
def get_image_url(key: str):
    key += "."
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=key)

    if 'Contents' not in response:
        raise_404_exception("Image not found")

    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": BUCKET_NAME, "Key": response['Contents'][0]['Key']},
        ExpiresIn=3600
    )

    return url


@router.put("/save")
async def save_image(decision: str,
                     frog_id: int,
                     organization_id: int,
                     controller: ImageController = Depends(ImageController)):
    if decision == "yes":
        if not images:
            raise_409_exception("No images to save")
        
        if frog_id not in images:
            raise_404_exception("Frog ID not found in images")

        temp_file_path = images.pop(frog_id)
        respone = controller.upload_to_s3(temp_file_path, organization_id, frog_id)
        os.remove(temp_file_path)
        return respone

    elif decision == "no":
        images.pop(frog_id, None)
        return {"message": "Image discarded"}
