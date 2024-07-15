from fastapi import APIRouter, Depends
from models.user import User
from util.util import get_current_user
from crud.notification import NotificationController

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
)

@router.get("")
async def get_notifications(controller: NotificationController = Depends(NotificationController)):
    return controller.get_notifications()

@router.post("/{type}/{organization_name}")
async def create_notification(type: str, organization_name: str, 
                              controller: NotificationController = Depends(NotificationController),
                              current_user: User = Depends(get_current_user)):
    return controller.create_notification(current_user, type, organization_name)

@router.post("/{type}/{organization_name}/{user_id}")
async def handle_notification(type: str, organization_name: str, user_id: int,
                              controller: NotificationController = Depends(NotificationController)):
    return controller.handle_notification(user_id, organization_name, type)

@router.delete("/{notification_id}")
async def delete_notification(notification_id: int, controller: NotificationController = Depends(NotificationController)):
    return controller.delete_notification(notification_id)