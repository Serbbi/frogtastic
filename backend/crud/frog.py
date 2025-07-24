import base64
import datetime
import io
from fastapi.responses import StreamingResponse
import numpy as np
from crud.controller import Controller
from models.frog import Frog
from schemas.frog import FrogResponse
from models.tank import Tank
from models.organization import Organization
from frogRetreiver import retrieve_frog, extract_image, extract_frog_and_tank
import zipfile
from sqlalchemy.orm.attributes import flag_modified
import cv2
import pandas as pd
import json
from google.cloud import storage

"""
In this file we have the methods that will perform the CRUD actions for the Frog on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

class FrogController(Controller):
    def get_frogs(self, org_q: int = None, tank_q: int = None, no_frogs_q: int = None):
        query = self.db.query(Frog)
        
        if tank_q:
            query = query.filter(Frog.current_tank_id == tank_q)
        if org_q:
            query = query.filter(Frog.organization_id == org_q)
        
        frogs = query.all()

        if no_frogs_q:
            frogs = frogs[:no_frogs_q]
        
        return frogs
    

    def get_frog(self, frog_id: int):
        storage_client = storage.Client()
        blobs = storage_client.list_blobs("cool_frog_bucket", prefix=f"uploads/{frog_id}")

        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        if db_frog:
            return FrogResponse.from_orm(db_frog).copy(update={"image_history": ["cool_frog_bucket/" + blob.name for blob in blobs]})
        return None
    

    def update_frogs(self, attributes: list, org_q: int):
        frogs = self.db.query(Frog).filter(Frog.organization_id == org_q).all()
        for db_frog in frogs:
            for attribute in attributes:
                if attribute not in db_frog.attributes:
                    db_frog.attributes[attribute] = ""
                else:
                    db_frog.attributes.pop(attribute)
            flag_modified(db_frog, "attributes")
            
        self.db.commit()
        return {"message": "Frogs updated successfully"}
    

    def create_frog(self, frog: Frog):
        already_exists = self.db.query(Frog).filter_by(frog_number=frog.frog_number, tank_id=frog.tank_id, organization_id=frog.organization_id).first()
        if(already_exists):
            return {"error": "Frog already exists"}
        db_frog = Frog(frog_number=frog.frog_number, tank_id=frog.tank_id, current_tank_id=frog.current_tank_id, attributes=frog.attributes, organization_id=frog.organization_id, history=frog.history, image_path=frog.image_path)
        self.db.add(db_frog)
        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def create_frogs(self, frogs: list):
        for frog in frogs:
            self.create_frog(frog)
        return {"message": "Frogs created successfully"}
    

    def get_frog_by_image(self, file, organization_id: int, model_id: int):
        if not file.content_type.endswith(("jpg", "jpeg", "png")):
            return {"error": "Only images are allowed"}

        nparr = np.frombuffer(file.file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img.shape[0] < 1500 or img.shape[1] < 1500:
            return {"error": "Image resolution must be at least 1500x1500"}

        extraction_image = extract_image(img)
        result = retrieve_frog(extraction_image, model_id)
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
            
            with open('image_paths.json') as f:
                image_paths = json.load(f)

            image_path = image_paths.get(f"{tank_id}{frog_number}")
            db_frog = self.create_frog(Frog(frog_number=frog_number, tank_id=tank_id, current_tank_id=None, attributes=attributes, organization_id=organization_id, history={}, image_path=image_path))

        # Leave it as base64 for now, we can change it to something different later
        return {"frog": db_frog, "image": base64.b64encode(img_bytes.getvalue()).decode('utf-8')}
    

    def update_frog(self, frog_id: int, frog: Frog, username: str):
        # if not verify_frog_details(frog):
            # return {"error": "Invalid frog details"}
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        if db_frog is None:
            return None

        db_frog.history = dict(update_history(db_frog, frog, username))
        db_frog.current_tank_id = frog.current_tank_id
        flag_modified(db_frog, "history")
        db_frog.attributes = frog.attributes
        db_frog.organization_id = frog.organization_id

        self.db.commit()
        self.db.refresh(db_frog)
        return db_frog
    

    def delete_frog(self, frog_id: int):
        db_frog = self.db.query(Frog).filter(Frog.id == frog_id).first()
        if db_frog is None:
            return None
        self.db.delete(db_frog)
        self.db.commit()
        return db_frog
    
    
    def delete_frogs_by_organization(self, org_q: int):
        frogs = self.db.query(Frog).filter(Frog.organization_id == org_q).all()
        for frog in frogs:
            self.db.delete(frog)
        self.db.commit()
        return {"message": "Frogs deleted successfully"}
    

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
        if df.empty:
            return {"error": "No frogs found"}
        df = df.drop(columns=["_sa_instance_state"])
        df["current_tank_id"] = df["current_tank_id"].apply(lambda x: next((tank.tank_name for tank in tanks if tank.id == x), None))
        df = df.rename(columns={"current_tank_id": "current_tank_name"})
        df["organization_id"] = organization.name
        df = df.rename(columns={"organization_id": "organization_name"})
        df = df.drop(columns=["id"])
        df = df.drop(columns=["image_path"])

        csv = df.to_csv(index=False)
        return StreamingResponse(io.BytesIO(csv.encode()), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=frogs.csv"})


    def upload_to_gcs(self, file_path: str, destination_blob_name: str) -> str:
        """Upload a file to GCS and return the public URL."""
        client = storage.Client()
        bucket = client.bucket("cool_frog_bucket")
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(file_path)

        return blob.public_url


def update_history(db_frog, frog, username):
    history = db_frog.history
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    if now not in history:  
        history[now] = {}

    if db_frog.current_tank_id != frog.current_tank_id:
        history[now]["current_tank_id"] = frog.current_tank_id
    for key, value in frog.attributes.items():
        if value != db_frog.attributes.get(key):
            history[now][key] = value
    
    history[now]["author"] = username
    return history

# returns True if the frog details are valid
def verify_frog_details(frog : Frog):
    if frog.current_tank_id != None and frog.current_tank_id < 0:
        return {"status": False, "error": "Invalid tank id"}
    if "egg_quality" in frog.attributes:
        if frog.attributes["egg_quality"] != "" and int(frog.attributes["egg_quality"]) < 0:
            return {"status": False, "error": "Egg quality must be a positive number greater than 0"}
    # add more if Julia thinks it is necessary
    return {"status": True}
