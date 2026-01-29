# The router that is used from all "/ml-models/*" endpoints.
from fastapi import APIRouter, Depends, UploadFile, File
from util import util
from util.exceptions import raise_403_exception
from util.globals import get_all_cached_models, get_model
from crud.ml_model import MLModelController

router = APIRouter(
    prefix="/ml-models",
    tags=["ml-models"],
    responses={
        404: {"description": "Not found"},
        401: {"description": "Token has expired"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("")
async def get_ml_models():
    return {"cached_models": list(get_all_cached_models().keys())}


@router.post("/upload")
async def upload_ml_model(org_q: int, 
                          model_file: UploadFile = File(...),
                          labeler_file: UploadFile = File(...),
                          current_user = Depends(util.get_current_user),
                          controller: MLModelController = Depends(MLModelController),
                          _: str = Depends(util.verify_token)):
    if util.get_general_access_right("canUploadMLModels", current_user):
        return controller.upload_ml_model(model_file, labeler_file, org_q)
    raise_403_exception("You cannot upload ML models for this organization")


@router.delete("/delete/{model_name}")
async def delete_ml_model(model_name: str,
                          org_q: int,
                          current_user = Depends(util.get_current_user),
                          controller: MLModelController = Depends(MLModelController),
                          _: str = Depends(util.verify_token)):
    if util.get_general_access_right("canUploadMLModels", current_user):
        return controller.delete_ml_model(model_name, org_q)
    raise_403_exception("You cannot delete ML models for this organization")