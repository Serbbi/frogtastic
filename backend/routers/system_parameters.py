from fastapi import APIRouter, Depends
from typing import Union, List
from crud.system_parameters import SystemParametersController
from schemas.system_parameters import SystemParametersRequest
from util.permissions import Permission
from models.user import User
from util import util

router = APIRouter(
    prefix="/system-parameters",
    tags=["system-parameters"],
    responses={
        404: {"description": "Not found"},
        401: {"description": "Token has expired"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.get("/download-csv")
async def download_system_parameters(org_id: Union[int, None] = None,
                                     controller: SystemParametersController = Depends(SystemParametersController),
                                     _: str = Depends(util.verify_token)):
    return controller.download_system_parameters(org_id)

@router.get("")
async def get_system_parameters(org_id: Union[int, None] = None,
                                controller: SystemParametersController = Depends(SystemParametersController)):
    return controller.get_system_parameters(org_id)

@router.post("")
async def create_system_parameters(system_params: dict,
                                   org_q: Union[int, None] = None,
                                   controller: SystemParametersController = Depends(SystemParametersController),
                                   _: User = Depends(util.require_simple_permission(Permission.EDIT_FROGS))):
    return controller.create_system_parameters_for_organization(org_q, system_params)

@router.put("/update-values")
async def update_list_values_existing(org_q: int, 
                                      new_parameters: List[str], 
                                      controller: SystemParametersController = Depends(SystemParametersController),
                                      _: User = Depends(util.require_simple_permission(Permission.EDIT_FROGS))):
    return controller.update_list_values_existing(org_q, new_parameters)

@router.put("")
async def update_system_parameters(system_params: List[SystemParametersRequest],
                                   org_q: Union[int, None] = None, # Necessary for permission
                                   controller: SystemParametersController = Depends(SystemParametersController),
                                   _: User = Depends(util.require_simple_permission(Permission.EDIT_FROGS))):
    return controller.update_system_parameters(system_params)

@router.delete("/bulk")
async def delete_system_parameters(system_params_ids: List[int],
                                   org_q: Union[int, None] = None, # Necessary for permission
                                   controller: SystemParametersController = Depends(SystemParametersController),
                                   _: User = Depends(util.require_simple_permission(Permission.DELETE_FROGS))):
    return controller.delete_system_parameters(system_params_ids)

@router.delete("/{system_params_id}")
async def delete_system_parameter(system_params_id: int,
                                  org_q: Union[int, None] = None, # Necessary for permission
                                  controller: SystemParametersController = Depends(SystemParametersController),
                                  _: User = Depends(util.require_simple_permission(Permission.DELETE_FROGS))):
    return controller.delete_system_parameter(system_params_id)
