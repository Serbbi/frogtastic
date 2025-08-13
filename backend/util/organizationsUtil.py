from fastapi import Depends
from util.util import get_current_user, get_general_access_right
from models.user import User


def get_create_organization_access_right(
    current_user: User = Depends(get_current_user),
):
    return get_general_access_right("canCreateOrganization", current_user)
