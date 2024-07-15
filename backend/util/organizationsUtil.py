from fastapi import Depends
from util.util import get_access_right, get_current_user
from models.user import User

def get_create_organization_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canCreateOrganization", current_user)