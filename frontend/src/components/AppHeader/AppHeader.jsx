import { useState } from 'react';
import UseAllNotifications from '../../hooks/useAllNotifications';
import './AppHeader.css';

export default function AppHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = UseAllNotifications();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    async function putRequest(organizationName, userId) {
        const token = localStorage.getItem('site');

        const response = await fetch(`http://localhost:8000/organizations/${organizationName}/join/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
            
        return await response.json();
    }

    async function deleteRequest(notificationId) {
        const token = localStorage.getItem('site');

        const response = await fetch(`http://localhost:8000/notifications/${notificationId}`, {
            method: 'DELETE'
        });
            
        return await response.json();
    }

    function handleNotification(notification) { 
        putRequest(notification.description.split(' ').pop(), notification.user_id)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

        deleteRequest(notification.id)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    return (
        <nav className="appHeader">
            <div className="leftSide">
                <img src="frog_logo.jpg" alt="logo" className='logo'/>
                <p>Dashboard</p>
            </div>
            <div className="rightSide">
                <button>Help</button>
                <button>Organizations</button>
                <button onClick={toggleMenu}>Notifications</button>
                {isOpen && (
                    <div className="dropdownMenu">
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>
                                    <div>
                                        <strong>{notification.title}</strong>
                                        <p>{notification.description}</p>
                                        <button onClick={() => handleNotification(notification)}>OK</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p>Username</p>
                <img src="user_icon.png" alt="user-icon" className='userIcon'/>
            </div>
        </nav>
    );
}