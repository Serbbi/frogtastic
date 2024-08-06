import { useState, useEffect } from 'react';
import UseAllNotifications from '../../hooks/useAllNotifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AppHeader.css';

export default function AppHeader({ organization, setOrganization }) {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = UseAllNotifications();
    const [ updatedNotifications, setUpdatedNotifications ] = useState(notifications);
    const userOrgs = localStorage.getItem('orgs').split(',');
    const username = localStorage.getItem('username');
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    useEffect(() => {
        setOrganization(userOrgs[0]);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    async function putRequest(organizationName, userId) {
        const token = localStorage.getItem('site');

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organizationName}/join/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
            
        return await response.json();
    }

    async function deleteRequest(notificationId) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/${notificationId}`, {
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
            setUpdatedNotifications(updatedNotifications.filter(notif => notif.id !== notification.id));
        })
        .catch(error => {
            console.error(error);
        });
    }

    function rejectNotification(notification) {
        deleteRequest(notification.id)
        .then(data => {
            console.log(data);
            setUpdatedNotifications(updatedNotifications.filter(notif => notif.id !== notification.id));
        })
        .catch(error => {
            console.error(error);
        });
    }

    function handleMenuOpen() {
        if (!isMenuOpen) {
            document.querySelector('.leftBar').style.left = '0';
        } else {
            document.querySelector('.leftBar').style.left = '-90px';
        }
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="appHeader">
            <div className="buttons">
                <button className='headerButton'>Help</button>
                {userOrgs.length > 1 ? <button className='headerButton'>Organizations</button> : null}
                <button className='headerButton' onClick={toggleMenu}>Notifications</button>
                <button id="menuButton" className='headerButton' onClick={handleMenuOpen}><FontAwesomeIcon icon="fa-solid fa-bars"/></button>
            </div>
            <div className="userContainer">
                <img src="/user_icon.png" alt="user-icon" className='userIcon'/>
                <div className="userContainerCenter">
                    <p className='userContainerUsername'>{username ? username : 'Username'}</p>
                    <p className='userContainerEmail'>tonieserban@yahoo.ro</p>
                </div>
                <FontAwesomeIcon icon="fa-solid fa-chevron-down" className='userContainerChevron'/>
            </div>

            {/* TODO: redo the notification dropdown */}
            {isOpen && (
                <div className="dropdownMenu">
                    <ul className='notificationList'>
                        {updatedNotifications.length === 0 && <li>No notifications</li>}
                        {updatedNotifications.map((notification, index) => (
                            <li key={index}>
                                <div className='notificationUp'>
                                    <strong>{notification.title}</strong>
                                </div>
                                <div className='notificationDown'>
                                    <p>{notification.description}</p>
                                    <div className='notificationDownRight'>
                                        <FontAwesomeIcon icon="fa-solid fa-square-check" className='notificationButton check' onClick={() => handleNotification(notification)}/>
                                        <FontAwesomeIcon icon="fa-solid fa-square-xmark" className='notificationButton xmark' onClick={() => rejectNotification(notification)}/>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}