import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseNotifications from "../../hooks/useNotifications";
import { useState, useEffect } from "react";

export default function NotificationItems({ organizationId, addShownNotifications }) {
    const { notifications, isLoading } = UseNotifications(organizationId);
    const [updatedNotifications, setUpdatedNotifications] = useState([]);

    useEffect(() => {
        if (!isLoading) {
            setUpdatedNotifications(notifications);
            addShownNotifications(notifications.length);
        }
    }, [notifications, isLoading]);

    async function postRequest(notificationId, action) {
        const token = localStorage.getItem('site');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/${notificationId}/handle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ action: action })
        });

        return await response.json();
    }

    function handleNotification(notification) {
        addShownNotifications(-1);
        postRequest(notification.id, 'accept')
            .then(data => {
                console.log(data);
                const newNotifications = updatedNotifications.filter(notif => notif.id !== notification.id);
                setUpdatedNotifications(newNotifications);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function rejectNotification(notification) {
        addShownNotifications(-1);
        postRequest(notification.id, 'reject')
            .then(data => {
                console.log(data);
                const newNotifications = updatedNotifications.filter(notif => notif.id !== notification.id);
                setUpdatedNotifications(newNotifications);
            })
            .catch(error => {
                console.error(error);
            });
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (updatedNotifications.length === 0) {
        return null;
    }

    return updatedNotifications.map((notification, index) => (
        <li key={index}>
            <div className='notificationUp'>
                <strong>{notification.title}</strong>
            </div>
            <div className='notificationDown'>
                <p>{notification.description}</p>
                <div className='notificationDownRight'>
                    <FontAwesomeIcon icon="fa-solid fa-square-check" className='notificationButton check' onClick={() => handleNotification(notification)} />
                    <FontAwesomeIcon icon="fa-solid fa-square-xmark" className='notificationButton xmark' onClick={() => rejectNotification(notification)} />
                </div>
            </div>
        </li>
    ));
}
