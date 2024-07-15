from fastapi import FastAPI
from database import engine, Base
from routers import frogs, image, login, users, organizations, tanks, notifications
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
app.include_router(organizations.router)
app.include_router(tanks.router)
app.include_router(notifications.router)


origins = [
    "http://145.97.186.95:3000",
    "http://100.88.77.29:3000",
    "http://100.66.180.14:3000",
    "http://192.168.68.100:3000",
    "http://145.97.186.95:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

