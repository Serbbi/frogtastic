import datetime

import numpy as np
from crud.controller import Controller
from models.frog import Frog
from frogRetreiver import retrieve_frog, extract_image, extract_frog_and_tank
from util.frogUtil import verify_frog_details
import zipfile
from sqlalchemy.orm.attributes import flag_modified
import cv2

"""
In this file we have the methods that will perform the CRUD actions for the Frog on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

class FrogController(Controller):
    def get_frogs(self):
        return self.db.query(Frog).all()
    

    def get_organization_frogs(self, organization_id: int):
        return self.db.query(Frog).filter(Frog.organization_id == organization_id).all()
    

    def get_organization_one_frog(self, organization_id: int):
        return self.db.query(Frog).filter(Frog.organization_id == organization_id).first()


    def get_frog(self, frog_id: int):
        return self.db.query(Frog).filter(Frog.id == frog_id).first()
    
    def add_frog_attributes(self, attributes: list, organization_id: int):
        frogs = self.db.query(Frog).filter(Frog.organization_id == organization_id).all()

        if "" in attributes:
            return {"error": "Attributes cannot be empty"}

        for frog in frogs:
            for attribute in attributes:
                frog.attributes[attribute] = ""

            flag_modified(frog, "attributes")
            self.db.commit()
            self.db.refresh(frog)
                    
        return {"message": "Attributes added successfully"}

    def delete_frog_attributes(self, attributes: list, organization_id: int):
        frogs = self.db.query(Frog).filter(Frog.organization_id == organization_id).all()
        for frog in frogs:
            for attribute in attributes:
                frog.attributes.pop(attribute, None)

            flag_modified(frog, "attributes")
            self.db.commit()
            self.db.refresh(frog)
                    
        return {"message": "Attributes deleted successfully"}

    def create_frog(self, frog: Frog):
        # if(verify_frog_details(frog)):
            # return {"error": "Invalid frog details"}
        already_exists = self.db.query(Frog).filter_by(frog_number=frog.frog_number, tank_id=frog.tank_id, organization_id=frog.organization_id).first()
        if(already_exists):
            return {"error": "Frog already exists"}
        db_frog = Frog(frog_number=frog.frog_number, tank_id=frog.tank_id, current_tank_id=frog.current_tank_id, attributes=frog.attributes, organization_id=frog.organization_id, history=frog.history)
        self.db.add(db_frog)
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def get_tank_frogs(self, current_tank_id: int):
        return self.db.query(Frog).filter(Frog.current_tank_id == current_tank_id).all()
    

    def get_frog_by_image(self, file):
        if not file.content_type.endswith(("jpg", "jpeg", "png")):
            return {"error": "Only images are allowed"}

        nparr = np.frombuffer(file.file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        extraction_image = extract_image(img)
        result = retrieve_frog(extraction_image)
        frog_number, tank_id = extract_frog_and_tank(result.split('\n')[0])

        return self.db.query(Frog).filter_by(frog_number=frog_number, tank_id=tank_id).first()
    

    def update_frog(self, frog_id: int, frog: Frog):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        # if(verify_frog_details(frog)):
            # return {"error": "Invalid frog details"}
        db_frog.history = dict(update_history(db_frog, frog))
        db_frog.current_tank_id = frog.current_tank_id
        flag_modified(db_frog, "history")
        db_frog.attributes = frog.attributes
        db_frog.organization_id = frog.organization_id
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def delete_frog(self, frog_id: int):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        self.db.delete(db_frog)
        self.db.commit()
        return db_frog
    
    def train_model(self, file):
        with zipfile.ZipFile(file.file, 'r') as zip_ref:
            file_names = zip_ref.namelist()
        for name in file_names:
            print(name)
        return {"message": "Model trained successfully"}


def update_history(db_frog, frog):
    history = db_frog.history
    status_string = ""

    if db_frog.current_tank_id != frog.current_tank_id:
        status_string += f"current_tank_id changed from '{db_frog.current_tank_id}' to '{frog.current_tank_id}'\n"
    for key, value in frog.attributes.items():
        if value != db_frog.attributes.get(key):
            status_string += f"{key} changed from '{db_frog.attributes.get(key)}' to '{value}'\n"
    if status_string:
        history[datetime.datetime.now().strftime("%Y-%m-%d %H:%M")] = status_string
    return history
    