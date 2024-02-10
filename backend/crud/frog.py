from crud.controller import Controller
from models.frog import Frog
import os
from frogRetreiver import retrieve_frog
from util.frogUtil import verify_frog_details

"""
In this file we have the methods that will perform the CRUD actions for the Frog on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

class FrogController(Controller):
    def get_frogs(self):
        return self.db.query(Frog).all()


    def get_frog(self, frog_id: int):
        return self.db.query(Frog).filter(Frog.id == frog_id).first()
    

    def create_frog(self, frog: Frog):
        if(verify_frog_details(frog)):
            return {"error": "Invalid frog details"}
        already_exists = self.db.query(Frog).filter_by(frog_number=frog.frog_number, tank_id=frog.tank_id).first()
        if(already_exists):
            return {"error": "Frog already exists"}
        db_frog = Frog(frog_number=frog.frog_number, last_injection=frog.last_injection, last_priming=frog.last_priming, notes=frog.notes,
                       sex=frog.sex, egg_quality=frog.egg_quality, tank_id=frog.tank_id, actual_tank_id=frog.actual_tank_id,
                       is_sick=frog.is_sick, is_laying_eggs=frog.is_laying_eggs)
        self.db.add(db_frog)
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def get_tank_frogs(self, actual_tank_id: int):
        return self.db.query(Frog).filter(Frog.actual_tank_id == actual_tank_id).all()
    

    def get_frog_by_image(self, file):
        if not file.content_type.endswith(("jpg", "jpeg", "png")):
            return {"error": "Only images are allowed"}

        with open(f"uploaded images/{file.filename}", "wb") as image:
            image.write(file.file.read())
        result = retrieve_frog(f"uploaded images/{file.filename}")

        os.remove(f"uploaded images/{file.filename}")

        first_line = result.split('\n')[0]
        frog_number = first_line.split('_')[0][-1]
        tank_id = first_line.split(' ')[1][-1]

        return self.db.query(Frog).filter_by(frog_number=frog_number, tank_id=tank_id).first()
    

    def update_frog(self, frog_id: int, frog: Frog):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        if(verify_frog_details(frog)):
            return {"error": "Invalid frog details"}
        db_frog.last_injection = frog.last_injection
        db_frog.last_priming = frog.last_priming
        db_frog.notes = frog.notes
        db_frog.sex = frog.sex
        db_frog.egg_quality = frog.egg_quality
        db_frog.actual_tank_id = frog.actual_tank_id
        db_frog.is_sick = frog.is_sick
        db_frog.is_laying_eggs = frog.is_laying_eggs
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def delete_frog(self, frog_id: int):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        self.db.delete(db_frog)
        self.db.commit()
        return db_frog


