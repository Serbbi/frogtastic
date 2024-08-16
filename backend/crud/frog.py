import datetime
import io
from fastapi.responses import StreamingResponse
import numpy as np
from crud.controller import Controller
from models.frog import Frog
from models.tank import Tank
from models.organization import Organization
from frogRetreiver import retrieve_frog, extract_image, extract_frog_and_tank
import zipfile
from sqlalchemy.orm.attributes import flag_modified
import cv2
import pandas as pd

"""
In this file we have the methods that will perform the CRUD actions for the Frog on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

class FrogController(Controller):
    def get_frogs(self, org_q: int = None, tank_q: int = None, no_frogs_q: int = None):
        query = self.db.query(Frog)
        
        if tank_q:
            query = query.filter(Frog.current_tank_id == tank_q)
        elif org_q:
            query = query.filter(Frog.organization_id == org_q)
        
        frogs = query.all()

        if no_frogs_q:
            frogs = frogs[:no_frogs_q]
        
        return frogs
    

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
        already_exists = self.db.query(Frog).filter_by(frog_number=frog.frog_number, tank_id=frog.tank_id, organization_id=frog.organization_id).first()
        if(already_exists):
            return {"error": "Frog already exists"}
        db_frog = Frog(frog_number=frog.frog_number, tank_id=frog.tank_id, current_tank_id=frog.current_tank_id, attributes=frog.attributes, organization_id=frog.organization_id, history=frog.history)
        self.db.add(db_frog)
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def get_frog_by_image(self, file, organization_id: int):
        if not file.content_type.endswith(("jpg", "jpeg", "png")):
            return {"error": "Only images are allowed"}

        nparr = np.frombuffer(file.file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        extraction_image = extract_image(img)
        result = retrieve_frog(extraction_image)
        if not result:
            return {"error": "Error handling image"}
        frog_number, tank_id = extract_frog_and_tank(result.split('\n')[0])

        _, buffer = cv2.imencode('.png', extraction_image)
        img_bytes = io.BytesIO(buffer.tobytes())

        db_frog = self.db.query(Frog).filter_by(frog_number=frog_number, tank_id=tank_id, organization_id=organization_id).first()
        if not db_frog:
            sample_frog = self.db.query(Frog).filter_by(organization_id=organization_id).first()
            if not sample_frog:
                attributes = {}
            else:
                sample_attributes = sample_frog.attributes.keys()
                attributes = {key: "" for key in sample_attributes}
            
            image_path = image_paths.get(f"{tank_id}{frog_number}")
            self.create_frog(Frog(frog_number=frog_number, tank_id=tank_id, current_tank_id=None, attributes=attributes, organization_id=organization_id, history={}, image_path=image_path))

        return StreamingResponse(img_bytes, media_type="image/png")
    

    def update_frog(self, frog_id: int, frog: Frog):
        if not verify_frog_details(frog):
            return {"error": "Invalid frog details"}
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()

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
    

    def download_csv(self, org_q: int, tank_q: int = None):
        query = self.db.query(Frog)
        tanks = self.db.query(Tank).all()
        organization = self.db.query(Organization).filter(Organization.id == org_q).first()

        query = query.filter(Frog.organization_id == org_q)
        if tank_q:
            query = query.filter(Frog.current_tank_id == tank_q)

        frogs = query.all()
        df = pd.DataFrame([frog.__dict__ for frog in frogs])
        df = df.drop(columns=["_sa_instance_state"])
        df["current_tank_id"] = df["current_tank_id"].apply(lambda x: next((tank.tank_name for tank in tanks if tank.id == x), None))
        df = df.rename(columns={"current_tank_id": "current_tank_name"})
        df["organization_id"] = organization.name
        df = df.rename(columns={"organization_id": "organization_name"})
        df = df.drop(columns=["id"])

        csv = df.to_csv(index=False)
        return StreamingResponse(io.BytesIO(csv.encode()), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=frogs.csv"})


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

# returns True if the frog details are valid
def verify_frog_details(frog : Frog):
    if frog.current_tank_id < 0:
        return False
    if "egg_quality" in frog.attributes:
        if frog.attributes["egg_quality"] != "" and int(frog.attributes["egg_quality"]) < 0:
            return False
    # add more if Julia thinks it is necessary
    return True
    
image_paths = {
    "11": "https://drive.google.com/uc?export=view&id=1tcFPy8RjPa00vnTYqrJ4z8BeSbwDVnY9",
    "12": "https://drive.google.com/uc?export=view&id=1SOxgByqfw2GdsXDfbKG-OjwQ6VPTYdaA",
    "13": "https://drive.google.com/uc?export=view&id=1mzQpxCX_TE6qDd6DXypl6GEaKVtM6-cd",
    "14": "https://drive.google.com/uc?export=view&id=15NXx94A-Xt5TfYVzu-0VsZHrPV-Qnjww",
    "15": "https://drive.google.com/uc?export=view&id=1sCez8lXw7CHi1dybajH2SGQq9yHy2y-o",
    "16": "https://drive.google.com/uc?export=view&id=1SJ3zv884KAsZCoIDKHdU_sUYM0qG5UkU",
    "17": "https://drive.google.com/uc?export=view&id=1ESAyKd6QnvhmhLborMdghxFk0OkXKlO-",
    "18": "https://drive.google.com/uc?export=view&id=1Smabarh2Ak_YB4_3vW5wUPb5hJurjGB4",
    "19": "https://drive.google.com/uc?export=view&id=1P4fjHAtNPQVQFk2q0WW6ELJ18JtDhkaC",
    "110": "https://drive.google.com/uc?export=view&id=16XQliTF3biFN5J2nnEKxVdVyxrmJuCMQ",
    "111": "https://drive.google.com/uc?export=view&id=1-ad-IJCzPsMijhFz2X5E9KyjgkujSkJw",
    "112": "https://drive.google.com/uc?export=view&id=1QwbKnEDKzJrNjfhWu2GTC_A4TAz9rSUm",
    "113": "https://drive.google.com/uc?export=view&id=153AgLPUJy355kXaZxa9Dh3p5-xjtvJIs",
    "114": "https://drive.google.com/uc?export=view&id=14SAv_ntNDKafz4DL1Es0oS94tpiQX9x4",
    "115": "https://drive.google.com/uc?export=view&id=1YnByFavnErp7-2gFOXTmmVtUeb9Gxko1",
    "116": "https://drive.google.com/uc?export=view&id=1ORp6QPkjrwPzqhJ88jk88Ukm01Kr9yQ-",
    "117": "https://drive.google.com/uc?export=view&id=1pr0uk0vkCCsGbp5PaB6R83Tg2RgmXpvt",
    "118": "https://drive.google.com/uc?export=view&id=1AY792rnJTvHM3_ZcVXPuK1u-triVqR_L",
    "119": "https://drive.google.com/uc?export=view&id=17ZRAGhHAEKdHw8oFQFs4hQcUy7eQ7e9j",
}