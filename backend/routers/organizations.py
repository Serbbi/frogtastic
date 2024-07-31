from fastapi import APIRouter, Depends
from crud.organization import OrganizationController
from schemas.organization import OrganizationBase
from util.organizationsUtil import get_create_organization_access_right
from util.exceptions import raise_access_right_exception
from models.user import User
from util.util import get_current_user
from typing import List

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
    raise_access_right_exception()

@router.get("")
async def get_organizations(controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organizations()

@router.get("/{organization_id}")
async def get_organization(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.get_organization(organization_id)

@router.put("/{organization_id}")
async def update_organization(organization_id: int, organization: OrganizationBase, controller: OrganizationController = Depends(OrganizationController)):
    return controller.update_organization(organization_id, organization)

@router.put("/{organization_name}/join/{user_id}")
async def join_organization(organization_name: str, user_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.join_organization(organization_name, user_id)

@router.delete("/{organization_id}")
async def delete_organization(organization_id: int, controller: OrganizationController = Depends(OrganizationController)):
    return controller.delete_organization(organization_id)

@router.post("/{organization_id}/table-columns")
async def create_table_columns(organization_id: int, table_columns: List[str], controller: OrganizationController = Depends(OrganizationController)):
    return controller.create_table_columns(organization_id, table_columns)

@router.delete("/{organization_id}/table-columns")
async def delete_table_columns(organization_id: int, table_columns: List[str], controller: OrganizationController = Depends(OrganizationController)):
    return controller.delete_table_columns(organization_id, table_columns)