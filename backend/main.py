from fastapi import FastAPI
from database import engine, Base
from routers import frogs, image, login, users
from fastapi.middleware.cors import CORSMiddleware

"""
Main starting point for the application.
"""

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(frogs.router)
app.include_router(image.router)
app.include_router(login.router)
app.include_router(users.router)


origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

