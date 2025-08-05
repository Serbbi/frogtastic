import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseNotifications from "../../hooks/useNotifications";
import { notificationHandleRequest } from "../../services/api/notifications/NotificationsPost";
import { useState, useRef, useEffect } from "react";

export default function NotificationDropdownAndButton({ organizationId }) {
    const { notifications, isLoading, mutate: mutateNotifications } = UseNotifications(organizationId);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    async function handleNotification(event, notification) {
        event.stopPropagation();

        notificationHandleRequest(notification.id, 'accept')
            .then(() => {
                mutateNotifications((notifications) =>
                    notifications.filter(notif => notif.id !== notification.id), false
                );
            });
    }

    async function rejectNotification(event, notification) {
        event.stopPropagation();

        notificationHandleRequest(notification.id, 'reject')
            .then(() => {
                mutateNotifications((notifications) =>
                    notifications.filter(notif => notif.id !== notification.id), false
                );
            });
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div ref={dropdownRef} className='newDropdown'>
            <button className='headerButton' onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon="fa-solid fa-bell" />
                {notifications.length > 0 && <span className='notificationBadge'></span>}
            </button>

            {isOpen &&
                <ul className='notificationList'>
                    {notifications.map(notification => (
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
                    ))}
                    {notifications.length === 0 &&
                        <li>There no new notifications!</li>
                    }
                </ul>
            }
        </div>
    );
}
