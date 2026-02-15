from fastapi import APIRouter, Depends, UploadFile, File
from crud.organization import OrganizationController
from schemas.organization import OrganizationBase, OrganizationResponse
from typing import Union, List
from models.user import User
from util.util import get_current_user, verify_token, require_general_permission
from util.permissions import Permission

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.post("", response_model=OrganizationResponse)
async def create_organization(organization: OrganizationBase, 
                              current_user: User = Depends(require_general_permission(Permission.CREATE_ORGANIZATION)),
                              controller: OrganizationController = Depends(OrganizationController)):
    return controller.create_organization(organization, current_user)

@router.get("", response_model=List[OrganizationResponse])
async def get_organizations(controller: OrganizationController = Depends(OrganizationController),
                            _: str = Depends(verify_token)):
    return controller.get_organizations()

@router.get("/{organization_id}", response_model=Union[OrganizationResponse, None])
async def get_organization(organization_id: int, 
                           controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organization(organization_id)

@router.get("/{organization_id}/download-csv")
async def download_parameters(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.download_parameters(organization_id)

@router.put("/{organization_id}")
async def update_organization(organization_id: int, organization: OrganizationBase, controller: OrganizationController = Depends(OrganizationController)):
    return controller.update_organization(organization_id, organization)

@router.put("/{organization_id}/quit")
async def quit_organization(organization_id: int, current_user: User = Depends(get_current_user), controller: OrganizationController = Depends(OrganizationController)):
    return controller.quit_organization(organization_id, current_user)

@router.put("/{organization_id}/logo")
async def update_profile_pic(
    organization_id: int, 
    file: UploadFile = File(..., size=10_000_000),
    current_user: User = Depends(get_current_user), 
    controller: OrganizationController = Depends(OrganizationController)
):
    return await controller.update_profile_pic(organization_id, file, current_user)

@router.delete("/{organization_id}")
async def delete_organization(organization_id: int, 
                              current_user: User = Depends(get_current_user),
                              controller: OrganizationController = Depends(OrganizationController)):
    return controller.delete_organization(organization_id, current_user)
