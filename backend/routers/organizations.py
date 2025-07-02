from fastapi import APIRouter, Depends
from crud.organization import OrganizationController
from schemas.organization import OrganizationBase
from util.organizationsUtil import get_create_organization_access_right
from util.exceptions import raise_403_exception
from models.user import User
from util.util import get_current_user, verify_token

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.post("")
async def create_organization(organization: OrganizationBase, 
                              access_right: bool = Depends(get_create_organization_access_right),
                              current_user: User = Depends(get_current_user),
                              controller: OrganizationController = Depends(OrganizationController)):
    if access_right:
        return controller.create_organization(organization, current_user)
    raise_403_exception("You do not have the right to create an organization")

@router.get("")
async def get_organizations(controller: OrganizationController = Depends(OrganizationController),
                            _: str = Depends(verify_token)):
    return controller.get_organizations()

@router.get("/{organization_id}")
async def get_organization(organization_id: int, 
                           controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organization(organization_id)

@router.get("/{organization_id}/download-csv")
async def download_parameters(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.download_parameters(organization_id)

@router.put("/{organization_id}")
async def update_organization(organization_id: int, organization: OrganizationBase, controller: OrganizationController = Depends(OrganizationController)):
    return controller.update_organization(organization_id, organization)

@router.delete("/{organization_id}")
async def delete_organization(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.delete_organization(organization_id)
