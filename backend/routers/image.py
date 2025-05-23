# The router that is used from all "/image/*" endpoints.
from fastapi import APIRouter, Depends, File, UploadFile
from crud.frog import FrogController
from util.exceptions import raise_404_exception
from typing import Union
import os
import tempfile
from util.google_drive_service_module import drive_service 
from fastapi import HTTPException

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
async def upload_image(organization_id: int, 
                       model_id: Union[int, None] = 1, 
                       file: UploadFile = File(..., size=10_000_000), controller: FrogController = Depends(FrogController)):
    db_frog = controller.get_frog_by_image(file, organization_id, model_id)
    if db_frog:
        images.append(file)
        return db_frog
    
    raise_404_exception("Frog not found")

@router.put("/save")
async def save_image(decision: str):
    if decision == "yes":
        try:
            # Save temp file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                contents = await file.read()
                temp_file.write(contents)
                temp_path = temp_file.name
            
            # Upload to Google Drive (replace 'your_folder_id' with actual folder ID)
            result = drive_service.upload_file(temp_path, folder_id=os.getenv('GOOGLE_DRIVE_FOLDER_ID'))
            
            # Clean up
            os.unlink(temp_path)
            
            return {
                "message": "File uploaded successfully",
                "file_id": result['file_id'],
                "view_link": result['web_view_link']
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    elif decision == "no":
        images.pop()