from crud.controller import Controller
from crud.organization import OrganizationController
from models.notification import Notification
from util.notification_types import NotificationTypes


class NotificationController(Controller):
    def get_notifications(self, org_q: int = None):
        if org_q:
            return self.db.query(Notification).filter(Notification.organization_id == org_q).all()
        return self.db.query(Notification).all()
    

    def create_notification(self, user, notification: Notification):
        # notification = Notification(title=type, description=f"{user.username} wants to join {organization_name}", organization_name=organization_name, user_id=user.id)
        if self.db.query(Notification).filter(Notification.user_id == user.id, Notification.organization_id == notification.organization_id).first():
            return {"error": "User already requested to join organization"}
        db_notification = Notification(title=notification.title, description=notification.description, organization_id=notification.organization_id, user_id=user.id)
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)
        return notification
    

    def handle_notification(self, notification_id: int, body: dict):
        notification = self.db.query(Notification).filter(Notification.id == notification_id).first()
        if notification.title == NotificationTypes['JOIN_REQUEST'].value:
            if body["action"] == "accept":
                org_controller = OrganizationController(self.db)
                org_controller.join_organization(notification.organization_id, notification.user_id)

        self.delete_notification(notification_id)
        return {"message": "Notification handled"}
    
    
    def delete_notification(self, notification_id: int):
        notification = self.db.query(Notification).filter(Notification.id == notification_id).first()
        self.db.delete(notification)
        self.db.commit()
        return notification