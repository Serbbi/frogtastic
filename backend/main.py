from fastapi import FastAPI
from database import engine, Base
from routers import frogs, image, login, users

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(frogs.router)
app.include_router(image.router)
app.include_router(login.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

