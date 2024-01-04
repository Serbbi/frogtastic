import os
from fastapi import FastAPI, File, UploadFile, Depends
from frogRetreiver import retrieveFrog
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class TankBase(BaseModel):
    number: int

class FrogBase(BaseModel):
    name: str
    age: int
    tank_id: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/image")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Check if the uploaded file is an image (optional)
    if not file.content_type.endswith(("jpg", "jpeg", "png")):
        return {"error": "Only images are allowed"}

    # Process the uploaded image
    with open(f"uploaded images/{file.filename}", "wb") as image:
        image.write(file.file.read())
    result = retrieveFrog(f"uploaded images/{file.filename}")

    # Delete image after processing
    os.remove(f"uploaded images/{file.filename}")

    first_line = result.split('\n')[0]
    print(first_line)
    frog_id = first_line.split('_')[0][-1]
    tank_id = first_line.split(' ')[1][-1]

    db_frog = db.query(models.Frog).filter_by(id=frog_id, tank_id=tank_id).first()

    if db_frog is None:
        return {"error": "Frog not found"}
    
    return db_frog

@app.post("/frog")
async def create_frog(frog: FrogBase, db: Session = Depends(get_db)):
    db_frog = models.Frog(name=frog.name, age=frog.age, tank_id=frog.tank_id)
    db.add(db_frog)
    db.commit()
    db.refresh(db_frog)
    return db_frog

@app.post("/tank")
async def create_tank(tank: TankBase, db: Session = Depends(get_db)):
    db_tank = models.Tank(number=tank.number)
    db.add(db_tank)
    db.commit()
    db.refresh(db_tank)
    return db_tank

@app.get("/frog/{frog_id}")
async def get_frog(frog_id: int, db: Session = Depends(get_db)):
    db_frog = db.query(models.Frog).filter(models.Frog.id == frog_id).first()
    return db_frog

@app.get("/tank/{tank_id}/frogs")
async def get_tank_frogs(tank_id: int, db: Session = Depends(get_db)):
    db_frogs = db.query(models.Frog).filter(models.Frog.tank_id == tank_id).all()
    return db_frogs