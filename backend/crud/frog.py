from crud.controller import Controller
from models.frog import Frog
import os
from frogRetreiver import retrieveFrog

"""
In this file we have the methods that will perform the CRUD actions for the Frog on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

class FrogController(Controller):
    def get_frog(self, frog_id: int):
        return self.db.query(Frog).filter(Frog.id == frog_id).first()
    

    def create_frog(self, frog: Frog):
        db_frog = Frog(name=frog.name, age=frog.age, tank_id=frog.tank_id)
        self.db.add(db_frog)
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def get_tank_frogs(self, tank_id: int):
        return self.db.query(Frog).filter(Frog.tank_id == tank_id).all()
    

    def get_frog_by_image(self, file):
        if not file.content_type.endswith(("jpg", "jpeg", "png")):
            return {"error": "Only images are allowed"}

        with open(f"uploaded images/{file.filename}", "wb") as image:
            image.write(file.file.read())
        result = retrieveFrog(f"uploaded images/{file.filename}")

        os.remove(f"uploaded images/{file.filename}")

        first_line = result.split('\n')[0]
        print(first_line)
        frog_id = first_line.split('_')[0][-1]
        tank_id = first_line.split(' ')[1][-1]

        return self.db.query(Frog).filter_by(id=frog_id, tank_id=tank_id).first()
    

    def update_frog(self, frog_id: int, frog: Frog):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        db_frog.name = frog.name
        db_frog.age = frog.age
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def delete_frog(self, frog_id: int):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        self.db.delete(db_frog)
        self.db.commit()
        return db_frog


