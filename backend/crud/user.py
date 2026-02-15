import re
from crud.controller import Controller
from models.user import User
from schemas.user import UserResponse
from PIL import Image
from storage import s3, BUCKET_NAME
import io

"""
In this file we have the methods that will perform the CRUD actions for the User on the database.
These methods will be used by the endpoints in the `routers` folder. 
"""

email_patterns = {
    "rug": r"rug\.nl$",
}

beginning_attributes = {
    "general_privileges": {
        "canCreateOrganization": False,
    }
}

class UserController(Controller):
    def get_user_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()
    

    def get_user_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()
    

    def create_admin_user(self, user: User):
        db_user = User(username=user.username, hashed_password=user.hashed_password, attributes=user.attributes, organizations=user.organizations, email=user.email)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    
    def create_user(self, user: User):
        db_user = User(username=user.username, hashed_password=user.hashed_password, attributes=beginning_attributes, organizations=user.organizations, email=user.email)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    

    def get_users(self, org_q: int = None):
        if org_q:
            return self.db.query(User).filter(User.organizations.any(org_q)).all()
        return self.db.query(User).all()
    

    def get_user_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()
    

    def build_user_response(self, user: User):
        profile_pic_url = ""
        if user:
            key = f"dev/user_profile_pics/{user.id}.jpeg"
            try:
                s3.head_object(Bucket=BUCKET_NAME, Key=key)
                profile_pic_url = s3.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": BUCKET_NAME, "Key": key},
                    ExpiresIn=3600,
                )
            except s3.exceptions.ClientError:
                profile_pic_url = ""
        return UserResponse.from_orm(user).copy(update={"profile_picture_url": profile_pic_url})


    def update_user(self, user_id: int, user: User):
        db_user = self.get_user_by_id(user_id)
        db_user.username = user.username
        db_user.organizations = user.organizations
        db_user.email = user.email
        db_user.attributes = user.attributes
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    

    def delete_user(self, user_id: int):
        db_user = self.get_user_by_id(user_id)
        self.db.delete(db_user)
        self.db.commit()
        return db_user
    

    def verify_email(self, email: str):
        for pattern in email_patterns:
            return re.search(email_patterns[pattern], email)
        
    
    async def update_profile_pic(self, user_id: int, file):
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
        
        s3_key = f"dev/user_profile_pics/{user_id}.jpeg"
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=output_buffer,
            ContentType="image/jpeg",
        )

        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": BUCKET_NAME, "Key": s3_key},
            ExpiresIn=3600,
        )
        return {"url": url}
        
