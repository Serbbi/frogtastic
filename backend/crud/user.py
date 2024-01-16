from crud.controller import Controller
from models.user import User

class UserController(Controller):
    def get_user_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    
    def create_user(self, user: User):
        db_user = User(username=user.username, hashed_password=user.hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    

    def get_users(self):
        return self.db.query(User).all()
    

    def get_user_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()
    

    def update_user(self, user_id: int, user: User):
        db_user = self.get_user_by_id(user_id)
        db_user.username = user.username
        db_user.hashed_password = user.hashed_password
        db_user.privileges = user.privileges
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    

    def delete_user(self, user_id: int):
        db_user = self.get_user_by_id(user_id)
        self.db.delete(db_user)
        self.db.commit()
        return db_user