from typing_extensions import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from crud.user import UserController
from jose import JWTError, jwt
from schemas.tokendata import TokenData
from dotenv import load_dotenv
import os
from passlib.context import CryptContext
import time

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
GENERAL_PRIVILEGES = 'general_privileges'

"""
This file contains utility functions for the login router.
"""


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str, controller: UserController = Depends(UserController)):
    user = controller.get_user_by_username(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], controller: UserController = Depends(UserController)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = controller.get_user_by_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def get_access_right(privilege: str, current_user: Annotated[User, Depends(get_current_user)]):
    if privilege in current_user.attributes['privileges']:
        return current_user.attributes['privileges'][privilege]
    return False


def get_general_access_right(privilege: str, current_user: Annotated[User, Depends(get_current_user)]):
    if GENERAL_PRIVILEGES not in current_user.attributes:
        return False
    if privilege in current_user.attributes[GENERAL_PRIVILEGES]:
        return current_user.attributes[GENERAL_PRIVILEGES][privilege]
    return False

def get_organization_access_right(org_id: str, privilege: str, current_user: Annotated[User, Depends(get_current_user)]):
    if org_id not in current_user.attributes:
        return False
    if privilege in current_user.attributes[org_id]:
        return current_user.attributes[org_id][privilege]
    return False

def verify_token(token: str = Depends(oauth2_scheme)):
    if token_is_expired(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

def token_is_expired(token: str) -> bool:
    print(token)
    if token == "null": return False # At login the token is null so we just skip it for now
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        print(payload.get("exp"))
        print(int(time.time()))
        if payload.get("exp") < int(time.time()) + 59:
            return True
        return False
    except JWTError:
        print("JWTError")
        return True # For some reason it gives error when it expires