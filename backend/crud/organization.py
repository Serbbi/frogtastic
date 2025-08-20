import io
import os

import pandas as pd
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from google.cloud import storage
from models.organization import Organization
from models.user import User
from PIL import Image
from sqlalchemy.orm.attributes import flag_modified

from crud.controller import Controller
from crud.frog import FrogController
from crud.tank import TankController


class OrganizationController(Controller):
    def create_organization(self, organization: Organization, user):
        db_organization = Organization(
            name=organization.name,
            participants=[user.id],
            admins=[user.id],
            table_columns=organization.table_columns,
            system_parameters={},
            system_parameter_names=organization.system_parameter_names,
        )
        self.db.add(db_organization)
        self.db.commit()
        self.db.refresh(db_organization)

        db_user = self.db.query(User).filter(User.id == user.id).first()
        if db_user.organizations is None:
            db_user.organizations = []
        db_user.organizations += (db_organization.id,)
        db_user.attributes[db_organization.id] = privileges_config(is_admin=True)
        flag_modified(db_user, "organizations")
        flag_modified(db_user, "attributes")
        self.db.commit()
        self.db.refresh(db_user)
        return db_organization

    def get_organizations(self):
        return self.db.query(Organization).all()

    def get_organization(self, organization_id: int):
        return (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )

    def update_organization(self, organization_id: int, organization: Organization):
        db_organization = (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )
        db_organization.name = organization.name
        db_organization.participants = organization.participants
        db_organization.table_columns = organization.table_columns
        db_organization.admins = organization.admins
        db_organization.system_parameters = organization.system_parameters
        db_organization.system_parameter_names = organization.system_parameter_names
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization

    def join_organization(self, organization_id: int, user_id: int):
        db_organization = (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )
        if (
            user_id not in db_organization.participants
        ):  # maybe return a 409 status code
            db_organization.participants += (user_id,)

        db_user = self.db.query(User).filter(User.id == user_id).first()
        if db_organization.id not in db_user.organizations:
            db_user.organizations += (db_organization.id,)
        db_user.attributes[db_organization.id] = privileges_config()
        flag_modified(db_user, "attributes")
        flag_modified(db_user, "organizations")

        self.db.commit()
        self.db.refresh(db_organization)
        self.db.refresh(db_user)
        return db_organization

    def delete_organization(self, organization_id: int):
        db_organization = (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )
        self.db.delete(db_organization)
        self.db.commit()
        return db_organization

    def download_parameters(self, organization_id: int):
        db_organization = (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )

        if db_organization.system_parameters:
            df = pd.DataFrame(db_organization.system_parameters)
            df.reset_index(inplace=True)
            df.rename(columns={"index": "Parameter"}, inplace=True)
        else:
            return {"error": "No System parameters found"}

        csv = df.to_csv(index=False)
        return StreamingResponse(
            io.BytesIO(csv.encode()),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=system_parameters.csv"
            },
        )

    def quit_organization(self, organization_id: int, user: User):
        db_organization = (
            self.db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )
        if not db_organization:
            return {"error": "Organization not found"}

        is_last_admin = (
            len(db_organization.admins) == 1 and user.id in db_organization.admins
        )
        is_last_participant = (
            len(db_organization.participants) == 1
            and user.id in db_organization.participants
        )

        if is_last_admin and is_last_participant:
            delete_all_frogs(organization_id, FrogController(self.db))
            delete_all_tanks(organization_id, TankController(self.db))
            user.organizations = tuple(
                o for o in user.organizations if o != organization_id
            )
            user.attributes.pop(str(organization_id), None)
            flag_modified(user, "organizations")
            flag_modified(user, "attributes")
            self.db.delete(db_organization)
            self.db.commit()
            self.db.refresh(user)
            return {"message": "Organization deleted successfully."}
        elif is_last_admin:
            raise HTTPException(
                status_code=403,
                detail="Cannot quit organization as the last admin. Please transfer admin rights first.",
            )
        else:
            if user.id in db_organization.participants:
                db_organization.participants = tuple(
                    p for p in db_organization.participants if p != user.id
                )
            if user.id in db_organization.admins:
                db_organization.admins = tuple(
                    a for a in db_organization.admins if a != user.id
                )

        if organization_id in user.organizations:
            user.organizations = tuple(
                o for o in user.organizations if o != organization_id
            )
            user.attributes.pop(str(organization_id), None)

        flag_modified(user, "organizations")
        flag_modified(user, "attributes")
        flag_modified(db_organization, "participants")
        flag_modified(db_organization, "admins")

        self.db.commit()
        self.db.refresh(user)
        if db_organization:
            self.db.refresh(db_organization)

        return db_organization

    async def update_profile_pic(self, organization_id, file):
        if not file.content_type.startswith("image/"):
            return {"error": "File must be an image"}

        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        image.thumbnail((256, 256))
        image = image.resize((256, 256))

        output_buffer = io.BytesIO()
        image.save(output_buffer, format="JPEG", quality=90)
        output_buffer.seek(0)

        storage_client = storage.Client()
        bucket = storage_client.bucket(os.getenv("GCS_BUCKET_NAME"))
        blob = bucket.blob(f"{os.getenv('GCS_ORG_LOGO_FOLDER')}/{organization_id}.jpeg")

        blob.cache_control = "no-cache, max-age=0"
        blob.upload_from_file(output_buffer, content_type="image/jpeg")
        blob.patch()
        return blob.public_url


def privileges_config(is_admin: bool = False):
    return {
        "canCreateFrogs": is_admin,
        "canEditFrogs": is_admin,
        "canDeleteFrogs": is_admin,
        "canRetrainModel": is_admin,
        "canGetUsers": is_admin,
        "canEditUsers": is_admin,
        "canDeleteUsers": is_admin,
    }


def delete_all_frogs(organization_id: int, frog_controller: FrogController):
    return frog_controller.delete_frogs_by_organization(organization_id)


def delete_all_tanks(organization_id: int, tank_controller: TankController):
    return tank_controller.delete_tanks_by_organization(organization_id)
