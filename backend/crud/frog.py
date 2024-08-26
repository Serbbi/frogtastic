import base64
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
            db_frog = self.create_frog(Frog(frog_number=frog_number, tank_id=tank_id, current_tank_id=None, attributes=attributes, organization_id=organization_id, history={}, image_path=image_path))

        # Leave it as base64 for now, we can change it to something different later
        return {"frog": db_frog, "image": base64.b64encode(img_bytes.getvalue()).decode('utf-8')}
    

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
    if frog.current_tank_id != None and frog.current_tank_id < 0:
        return False
    if "egg_quality" in frog.attributes:
        if frog.attributes["egg_quality"] != "" and int(frog.attributes["egg_quality"]) < 0:
            return False
    # add more if Julia thinks it is necessary
    return True
    
image_paths = {
    "11": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog1_tank1_DT_MiMix2_trip.png",
    "12": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog2_tank1_DT_MiMix2_trip.png",
    "13": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog3_tank1_DT_MiMix2_trip(2).png",
    "14": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog4_tank1_DT_MiMix2_trip.png",
    "15": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog5_tank1_DT_MiMix2_trip.png",
    "16": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog6_tank1_DT_MiMix2_trip.png",
    "17": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog7_tank1_DT_MiMix2_trip.png",
    "18": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog8_tank1_DT_MiMix2_trip(2).png",
    "19": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog9_tank1_DT_MiMix2_trip(2).png",
    "110": "https://storage.googleapis.com/cool_frog_bucket/frogs/220728_frog10_tank1_DT_MiMix2_trip(2).png",
    "111": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog11_tank1_DT_MiMix2_tripod.png",
    "112": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog12_tank1_DT_MiMix2_tripod.png",
    "113": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog13_tank1_DT_MiMix2_tripod(2).png",
    "114": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog14_tank1_DT_MiMix2_tripod.png",
    "115": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog15_tank1_DT_MiMix2_tripod(2).png",
    "116": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog16_tank1_DT_MiMix2_tripod(2).png",
    "117": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog17_tank1_DT_MiMix2_tripod.png",
    "118": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog18_tank1_DT_MiMix2_tripod(2).png",
    "119": "https://storage.googleapis.com/cool_frog_bucket/frogs/220729_frog19_tank1_DT_MiMix2_tripod.png",
    "21": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog1_tank2_DT_MiMix2_trip.png",
    "22": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog2_tank2_DT_MiMix2_trip.png",
    "23": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog3_tank2_DT_MiMix2_trip.png",
    "24": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog4_tank2_DT_MiMix2_trip.png",
    "25": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog5_tank2_DT_MiMix2_trip.png",
    "26": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog6_tank2_DT_MiMix2_trip.png",
    "27": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog7_tank2_DT_MiMix2_trip.png",
    "28": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog8_tank2_DT_MiMix2_trip.png",
    "29": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog9_tank2_DT_MiMix2_trip.png",
    "210": "https://storage.googleapis.com/cool_frog_bucket/frogs/220801_frog10_tank2_DT_MiMix2_trip.png",
    "211": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog11_tank2_DT_MiMix2_trip.png",
    "212": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog12_tank2_DT_MiMix2_trip.png",
    "213": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog13_tank2_DT_MiMix2_trip.png",
    "214": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog14_tank2_DT_MiMix2_trip.png",
    "215": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog15_tank2_DT_MiMix2_trip.png",
    "216": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog16_tank2_DT_MiMix2_trip(2).png",
    "217": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog17_tank2_DT_MiMix2_trip.png",
    "218": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog18_tank2_DT_MiMix2_trip.png",
    "219": "https://storage.googleapis.com/cool_frog_bucket/frogs/220802_frog19_tank2_DT_MiMix2_trip.png",
    "31": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog1_tank3_DT_MiMix2_trip.png",
    "32": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog2_tank3_DT_MiMix2_trip.png",
    "33": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog3_tank3_DT_MiMix2_trip.png",
    "34": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog4_tank3_DT_MiMix2_trip.png",
    "35": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog5_tank3_DT_MiMix2_trip.png",
    "36": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog6_tank3_DT_MiMix2_trip.png",
    "37": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog7_tank3_DT_MiMix2_trip(2).png",
    "38": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog8_tank3_DT_MiMix2_trip(2).png",
    "39": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog9_tank3_DT_MiMix2_trip.png",
    "310": "https://storage.googleapis.com/cool_frog_bucket/frogs/220803_frog10_tank3_DT_MiMix2_trip.png",
    "311": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog11_tank3_DT_MiMix2_trip.png",
    "312": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog12_tank3_DT_MiMix2_trip(2).png",
    "313": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog13_tank3_DT_MiMix2_trip(2).png",
    "314": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog14_tank3_DT_MiMix2_trip(2).png",
    "315": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog15_tank3_DT_MiMix2_trip(2).png",
    "316": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog16_tank3_DT_MiMix2_trip.png",
    "317": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog17_tank3_DT_MiMix2_trip(2).png",
    "318": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog18_tank3_DT_MiMix2_trip.png",
    "319": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog19_tank3_DT_MiMix2_trip.png",
    "320": "https://storage.googleapis.com/cool_frog_bucket/frogs/220804_frog20_tank3_DT_MiMix2_trip.png"
}