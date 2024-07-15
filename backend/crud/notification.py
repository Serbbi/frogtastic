from crud.controller import Controller
from crud.organization import OrganizationController
from models.notification import Notification
from util.notification_types import NotificationTypes


class NotificationController(Controller):
    def get_notifications(self):
        return self.db.query(Notification).all()
    
    def create_notification(self, user, type, organization_name):
        notification = Notification(title=type, description=f"{user.username} wants to join {organization_name}", organization_name=organization_name, user_id=user.id)
        if self.db.query(Notification).filter(Notification.user_id == user.id, Notification.organization_name == organization_name).first():
            return {"error": "User already requested to join organization"}
        
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification
    
    # def handle_notification(self, user_id: int, organization_name: str, type: str):
    #     if type == NotificationTypes.JOIN_REQUEST.value:
            
    
    def delete_notification(self, notification_id: int):
        notification = self.db.query(Notification).filter(Notification.id == notification_id).first()
        self.db.delete(notification)
        self.db.commit()
        return notification