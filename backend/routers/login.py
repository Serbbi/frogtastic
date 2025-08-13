# The router that is used for the login endpoint.
import os
from datetime import datetime, timedelta
from typing import Union

from crud.user import UserController
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from typing_extensions import Annotated
from util.util import authenticate_user

load_dotenv()

router = APIRouter()


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM")
    )
    return encoded_jwt


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    controller: UserController = Depends(UserController),
):
    user_db = authenticate_user(form_data.username, form_data.password, controller)
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    )
    access_token = create_access_token(
        data={"sub": user_db.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "dict": user_db.attributes,
        "organizations": user_db.organizations,
        "id": user_db.id,
        "username": user_db.username,
        "email": user_db.email,
    }
