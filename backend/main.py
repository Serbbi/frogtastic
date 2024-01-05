import os
from fastapi import FastAPI
from database import engine, Base
from routers import frogs, tank, image

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(frogs.router)
app.include_router(tank.router)
app.include_router(image.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
