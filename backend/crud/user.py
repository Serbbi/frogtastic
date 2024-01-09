from crud.controller import Controller
from models.user import User

class UserController(Controller):
    def get_user_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()
    

    def create_user(self, user: User):
        db_user = User(username=user.username, hashed_password=user.hashed_password, privileges=user.privileges)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user