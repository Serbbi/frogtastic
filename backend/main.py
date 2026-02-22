from fastapi import FastAPI
from database import engine, Base
from routers import frogs, image, login, users, organizations, tanks, notifications, email, ml_models
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import SessionLocal
from util.globals import init as init_globals
from sqlalchemy.orm import Session
from crud.user import UserController
from models.user import User
from starlette.middleware.base import BaseHTTPMiddleware
import os

"""
Main starting point for the application.
"""

async def create_initial_admin(db: Session) -> None:
    """Create initial admin user if configured"""
    if not (admin_creds := os.getenv("INITIAL_ADMIN_CREDS")):
        return
        
    username, password = admin_creds.split(":")
    controller = UserController(db)
    
    if controller.get_user_by_username(username):
        print("Admin user already exists")
        return
        
    admin_user = controller.create_admin_user(
        User(
            username=username,
            hashed_password=password,
            attributes={
                "general_privileges": {
                    "canCreateOrganization": True,
                    "canDeleteOrganization": True,
                    "canAddMLModels": True,
                    "canRemoveMLModels": True,
                    "canGetUsers": True,
                    "canEditUsers": True,
                    "canDeleteUsers": True
                }
            },
            organizations=[],
            email=f"{username}@admin.rug.nl"
        )
    )
    print(f"Admin created: {admin_user.username}")


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Application lifespan management"""
    # Initialize database
    Base.metadata.create_all(bind=engine)

    # Initialize global variables
    init_globals()
    
    # Create initial admin
    db = SessionLocal()
    try:
        await create_initial_admin(db)
    finally:
        db.close()
    
    yield

class RemoveApiPrefixMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Check if the path starts with /api
        if request.scope["path"].startswith("/api"):
            # Remove the /api prefix
            request.scope["path"] = request.scope["path"][4:]
        response = await call_next(request)
        return response

app = FastAPI(lifespan=lifespan)

app.include_router(frogs.router)
app.include_router(image.router)
app.include_router(login.router)
app.include_router(users.router)
app.include_router(organizations.router)
app.include_router(tanks.router)
app.include_router(notifications.router)
# app.include_router(email.router)
app.include_router(ml_models.router)

app.add_middleware(RemoveApiPrefixMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://frog.web.rug.nl", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
