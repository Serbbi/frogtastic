import os

from crud.user import UserController
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from models.user import User
from passlib.context import CryptContext
from schemas.tokendata import TokenData
from typing_extensions import Annotated
from util.permissions import Permission
from util.resource_access import get_resource_org_ids

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
GENERAL_PRIVILEGES = "general_privileges"


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(
    username: str, password: str, controller: UserController = Depends(UserController)
):
    user = controller.get_user_by_username(username)
    if not user:
        return None
    if not user.hashed_password:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    controller: UserController = Depends(UserController),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")]
        )
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


def get_access_right(
    privilege: str, current_user: Annotated[User, Depends(get_current_user)]
):
    if privilege in current_user.attributes["privileges"]:
        return current_user.attributes["privileges"][privilege]
    return False


def get_general_access_right(
    privilege: str, current_user: Annotated[User, Depends(get_current_user)]
):
    if GENERAL_PRIVILEGES not in current_user.attributes:
        return False
    if privilege in current_user.attributes[GENERAL_PRIVILEGES]:
        return current_user.attributes[GENERAL_PRIVILEGES][privilege]
    return False


def get_organization_access_right(
    org_id: str,
    permission: Permission,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if org_id not in current_user.attributes:
        return False
    if permission.value in current_user.attributes[org_id]:
        return current_user.attributes[org_id][permission.value]
    return False


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")],
            options={"leeway": 60},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_simple_permission(permission: Permission):
    def dependency(
           org_q: int,
           current_user: User = Depends(get_current_user) 
    ):
        if not get_organization_access_right(str(org_q), permission, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        
        return current_user
        
    return dependency


def require_resource_permission(resource_dep, permission: Permission):
    """
    resource_dep: a dependency function that returns ONE resource (e.g., load_user)
    """
    def dependency(
        resource = Depends(resource_dep),
        current_user: User = Depends(get_current_user),
    ):
        if not user_has_permission_on_resource(current_user, resource, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return resource

    return dependency

def require_list_resource_permission(list_loader, permission: Permission):
    """
    list_loader: dependency that returns a list of resources (e.g., load_all_users)
    """
    def dependency(
        resources = Depends(list_loader),
        current_user: User = Depends(get_current_user)
    ):
        allowed = [
            r for r in resources
            if user_has_permission_on_resource(current_user, r, permission)
        ]

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access any of these resources",
            )
        return allowed

    return dependency


def user_has_permission_on_resource(user: User, resource, permission: Permission) -> bool:
    if get_general_access_right(permission.value, user):
        return True

    resource_orgs = set(get_resource_org_ids(resource))
    user_orgs = set(user.organizations)
    shared = resource_orgs & user_orgs

    for org_id in shared:
        if get_organization_access_right(str(org_id), permission, user):
            return True

    return False

