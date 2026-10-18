import { useNotification } from "../../services/providers/NotificationProvider";
import Notification from "./Notification";
import './Notification.css';

export default function NotificationList() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="notifications">
            {notifications.map((notification) => (
                <Notification key={notification.id}
                    message={notification.text}
                    type={notification.type}
                    deleteNotification={() => removeNotification(notification.id)} />
            ))}
        </div>
    );
}