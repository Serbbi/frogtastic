import { useState, useEffect } from 'react';
import UseAllNotifications from '../../hooks/useAllNotifications';
import { useOrganization } from '../../hooks/OrganizationProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AppHeader.css';

export default function AppHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = UseAllNotifications();
    const userOrgs = localStorage.getItem('orgs').split(',');
    const username = localStorage.getItem('username');
    const { organization, setOrganization } = useOrganization();

    useEffect(() => {
        setOrganization(userOrgs[0]);
    }, []);

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
    }

    function rejectNotification(notification) {
        deleteRequest(notification.id)
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <nav className="appHeader">
            <div className="leftSide">
                {organization ? <img src="frog_logo.jpg" alt="logo" className='logo'/> : null}
                {organization ? <p>{organization.name}</p> : null}
            </div>
            <div className="rightSide">
                <button className='headerButton'>Help</button>
                {userOrgs.length > 1 ? <button className='headerButton'>Organizations</button> : null}
                <button className='headerButton' onClick={toggleMenu}>Notifications</button>
                {isOpen && (
                    <div className="dropdownMenu">
                        <ul className='notificationList'>
                            {notifications.length === 0 && <li>No notifications</li>}
                            {notifications.map((notification, index) => (
                                <li key={index}>
                                    <div className='notificationUp'>
                                        <strong>{notification.title}</strong>
                                    </div>
                                    <div className='notificationDown'>
                                        <p>{notification.description}</p>
                                        <div className='notificationDownRight'>
                                            <FontAwesomeIcon icon="fa-solid fa-square-check" className='notificationButton check' onClick={() => handleNotification(notification)}/>
                                            <FontAwesomeIcon icon="fa-solid fa-square-xmark" className='notificationButton xmark' onClick={() => rejectNotification(notification)}/>
                                            {/* <button onClick={() => handleNotification(notification)}>OK</button> */}
                                            {/* <button>No</button> */}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p>{username ? username : 'Username'}</p>
                <img src="user_icon.png" alt="user-icon" className='userIcon'/>
            </div>
        </nav>
    );
}