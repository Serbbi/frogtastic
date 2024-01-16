from fastapi import Depends
from util.util import get_access_right, get_current_user
from models.user import User
from models.frog import Frog

"""
This file contains utility functions for the frog router.
"""

def get_create_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canCreateFrogs", current_user)

def get_edit_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canEditFrogs", current_user)

def get_delete_frog_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canDeleteFrogs", current_user)

def verify_frog_details(frog : Frog):
    if(frog.egg_quality < 0 or frog.egg_quality > 5):
        # print("egg quality")
        return True
    if(frog.sex.lower() != "m" and frog.sex.lower() != "f"):
        # print("sex")
        return True
    if(frog.tank_id < 0):
        # print("tank id")
        return True
    if(frog.actual_tank_id < 0):
        # print("actual tank id")
        return True
    return False

