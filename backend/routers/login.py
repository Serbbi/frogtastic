# The router that is used for the login endpoint.
import os
from datetime import datetime, timedelta
from typing import Union

import requests
from crud.user import UserController
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
    OAuth2PasswordRequestForm,
)
from jose import JWTError, jwt
from pydantic import BaseModel
from schemas.user import UserBase
from typing_extensions import Annotated
from util.util import authenticate_user, verify_token

load_dotenv()

security = HTTPBearer()
router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


class GoogleAuthRequest(BaseModel):
    token: str


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


@router.post("/validate-token")
async def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    controller: UserController = Depends(UserController),
    _: str = Depends(verify_token),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")]
        )

        return controller.get_user_by_username(payload.get("sub"))
    except JWTError:
        return {"status": "invalid"}


@router.post("/token/google")
async def google_login(
    auth: GoogleAuthRequest, controller: UserController = Depends(UserController)
):
    try:
        res = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {auth.token}"},
        )

        if res.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid access token")

        user_info = res.json()
        email = user_info["email"]
        name = user_info["name"]

        user = controller.get_user_by_email(email)

        if not user:
            user = controller.create_user(
                UserBase(
                    username=name,
                    hashed_password="",
                    email=email,
                    attributes={},
                    organizations=[],
                )
            )

        access_token_expires = timedelta(
            minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
        )
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "dict": user.attributes,
            "organizations": user.organizations,
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }

    except Exception:
        raise HTTPException(
            status_code=500, detail="Failed to authenticate with Google"
        )
