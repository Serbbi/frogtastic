# The router that is used from all "/ml-models/*" endpoints.
from fastapi import APIRouter, Depends, UploadFile, File
from util import util
from util.globals import get_all_cached_models
from crud.ml_model import MLModelController
from util.permissions import Permission
from models.user import User

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


@router.get("/names")
async def get_organization_model_names(org_q: int,
                                       controller: MLModelController = Depends(MLModelController),
                                       _: str = Depends(util.verify_token)):
    return controller.get_organization_model_names(org_q)


@router.post("/upload")
async def upload_ml_model(org_q: int, 
                          model_file: UploadFile = File(...),
                          labeler_file: UploadFile = File(...),
                          current_user: User = Depends(util.require_general_permission(Permission.ADD_ML_MODELS)),
                          controller: MLModelController = Depends(MLModelController),
                          _: str = Depends(util.verify_token)):
    return controller.upload_ml_model(model_file, labeler_file, org_q)


@router.delete("/delete/{model_name}")
async def delete_ml_model(model_name: str,
                          org_q: int,
                          current_user: User = Depends(util.require_general_permission(Permission.REMOVE_ML_MODELS)),
                          controller: MLModelController = Depends(MLModelController),
                          _: str = Depends(util.verify_token)):
    return controller.delete_ml_model(model_name, org_q)