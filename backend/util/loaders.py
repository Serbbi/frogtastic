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


def load_frog(frog_id: int, controller: FrogController = Depends(FrogController)):
    return controller.get_frog(frog_id)
