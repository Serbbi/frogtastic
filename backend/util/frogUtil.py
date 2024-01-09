from fastapi import Depends
from util.util import get_access_right, get_current_user
from models.user import User


def get_create_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canCreateFrogs", current_user)

def get_edit_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canEditFrogs", current_user)

def get_delete_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canDeleteFrogs", current_user)

