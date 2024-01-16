from fastapi import Depends
from util.util import get_access_right, get_current_user
from models.user import User
from models.frog import Frog


def get_create_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canCreateFrogs", current_user)

def get_edit_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canEditFrogs", current_user)

def get_delete_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canDeleteFrogs", current_user)

def verify_frog_details(frog : Frog):
    if(frog.egg_quality < 0 or frog.egg_quality > 5):
        return True
    if(frog.sex is not "m" or frog.sex is not "f"):
        return True
    if(frog.tank_id < 0):
        return True
    if(frog.actual_tank_id < 0):
        return True
    return False

