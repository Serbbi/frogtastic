from typing import Union
from fastapi import APIRouter, Depends
from models.user import User
from util.util import get_current_user
from crud.notification import NotificationController
from schemas.notification import NotificationBase

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
)

@router.get("")
async def get_notifications(org_q: Union[int, None] = None, controller: NotificationController = Depends(NotificationController)):
    return controller.get_notifications(org_q)


@router.post("")
async def create_notification(notification: NotificationBase,
                              controller: NotificationController = Depends(NotificationController)):
    return controller.create_notification(notification)


@router.post("/{notification_id}/handle")
async def handle_notification(notification_id: int, 
                              body: dict, 
                              user: User = Depends(get_current_user),
                              controller: NotificationController = Depends(NotificationController)):
    return controller.handle_notification(notification_id, body, user)


@router.delete("/{notification_id}")
async def delete_notification(notification_id: int, controller: NotificationController = Depends(NotificationController)):
    return controller.delete_notification(notification_id)