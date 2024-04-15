from fastapi import APIRouter, Depends
from crud.organization import OrganizationController
from schemas.organization import OrganizationBase

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
    responses={
        404: {"description": "Not found"},
        400: {"description": "Request was not well-formed, see error details"},
    },
)

@router.post("")
async def create_organization(organization: OrganizationBase, controller: OrganizationController = Depends(OrganizationController)):
    return controller.create_organization(organization)

@router.get("")
async def get_organizations(controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organizations()

@router.get("/{organization_id}")
async def get_organization(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organization(organization_id)

@router.put("/{organization_id}")
async def update_organization(organization_id: int, organization: OrganizationBase, controller: OrganizationController = Depends(OrganizationController)):
    return controller.update_organization(organization_id, organization)

@router.delete("/{organization_id}")
async def delete_organization(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.delete_organization(organization_id)