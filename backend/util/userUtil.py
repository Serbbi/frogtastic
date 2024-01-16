from fastapi import Depends
from util.util import get_access_right, get_current_user
from models.user import User

"""
This file contains utility functions for the user router.
"""

def get_get_user_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canGetUsers", current_user)

def get_edit_user_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canEditUsers", current_user)

def get_delete_user_access_right(current_user: User = Depends(get_current_user)):
    return get_access_right("canDeleteUsers", current_user)