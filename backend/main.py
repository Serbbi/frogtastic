from fastapi import Depends, FastAPI, HTTPException
from database import engine, Base
from routers import frogs, image, login
from crud.user import UserController
from schemas.user import UserBase
import util.util as util

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(frogs.router)
app.include_router(image.router)
app.include_router(login.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/users/")
async def create_user(user: UserBase, controller: UserController = Depends(UserController)):
    user_db = controller.get_user_by_username(user.username)
    if user_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user.hashed_password = util.get_password_hash(user.hashed_password)
    controller.create_user(user)
    return user

