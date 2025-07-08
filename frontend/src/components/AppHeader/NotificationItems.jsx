import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseNotifications from "../../hooks/useNotifications";
import { notificationHandleRequest } from "../../services/api/notifications/NotificationsPost";
import { useEffect } from "react";

export default function NotificationItems({ organizationId, addShownNotifications }) {
    const { notifications, isLoading, mutate: mutateNotifications } = UseNotifications(organizationId);

    useEffect(() => {
        if (!isLoading) {
            addShownNotifications(notifications.length);
        }
    }, [notifications, isLoading]);

    async function handleNotification(event, notification) {
        event.stopPropagation();
        addShownNotifications(-1);

        try {
            const data = await notificationHandleRequest(notification.id, 'accept');
            console.log(data);

            await mutateNotifications((notifications) =>
                notifications.filter(notif => notif.id !== notification.id),
                false
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function rejectNotification(event, notification) {
        event.stopPropagation();
        addShownNotifications(-1);

        try {
            const data = await notificationHandleRequest(notification.id, 'reject');
            console.log(data);

            await mutateNotifications((notifications) =>
                notifications.filter(notif => notif.id !== notification.id),
                false
            );
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (notifications.length === 0) {
        return null;
    }

    return notifications.map(notification => (
        <li key={notification.id}>
            <div className='notificationUp'>
                <strong>{notification.title}</strong>
            </div>
            <div className='notificationDown'>
                <p>{notification.description}</p>
                <div className='notificationDownRight'>
                    <FontAwesomeIcon icon="fa-solid fa-square-check" className='notificationButton check' onClick={(e) => handleNotification(e, notification)} />
                    <FontAwesomeIcon icon="fa-solid fa-square-xmark" className='notificationButton xmark' onClick={(e) => rejectNotification(e, notification)} />
                </div>
            </div>
        </li>
    ));
}
