from models.notification import Notification
from util.exceptions import raise_403_exception, raise_409_exception
from util.notification_types import NotificationTypes

from crud.controller import Controller
from crud.organization import OrganizationController


class NotificationController(Controller):
    def get_notifications(self, org_q: int = None):
        if org_q:
            return (
                self.db.query(Notification)
                .filter(Notification.organization_id == org_q)
                .all()
            )
        return self.db.query(Notification).all()

    def create_notification(self, notification: Notification):
        if (
            self.db.query(Notification)
            .filter(
                Notification.user_id == notification.user_id,
                Notification.organization_id == notification.organization_id,
            )
            .first()
        ):
            raise_409_exception("User has already requested to join organization")
        db_notification = Notification(
            title=notification.title,
            description=notification.description,
            organization_id=notification.organization_id,
            user_id=notification.user_id,
        )
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)
        return db_notification

    def handle_notification(self, notification_id: int, body: dict, user):
        notification = (
            self.db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )
        org_controller = OrganizationController(self.db)
        organization = org_controller.get_organization(notification.organization_id)

        if user.id not in organization.admins:
            raise_403_exception("User does not have permission to handle notification")

        if notification.title == NotificationTypes["JOIN_REQUEST"].value:
            if body["action"] == "accept":
                org_controller.join_organization(
                    notification.organization_id, notification.user_id
                )

        self.delete_notification(notification_id)
        return {"message": "Notification handled"}

    def delete_notification(self, notification_id: int):
        notification = (
            self.db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )
        self.db.delete(notification)
        self.db.commit()
        return notification
