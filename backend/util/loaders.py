from fastapi import Depends, HTTPException
from crud.frog import FrogController
from crud.user import UserController

def load_users(org_q: int = None, controller: UserController = Depends(UserController)):
    return controller.get_users(org_q)

def load_user(user_id: int, controller: UserController = Depends(UserController)):
    user = controller.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def load_frogs(org_q: int = None, controller: FrogController = Depends(FrogController)):
    return controller.get_frogs(org_q)

def load_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    frog = controller.get_frog(frog_id)
    if not frog:
        raise HTTPException(status_code=404, detail="Frog not found")
    return frog