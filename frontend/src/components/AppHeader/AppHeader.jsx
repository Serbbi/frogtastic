import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationItems from './NotificationItems';
import './AppHeader.css';

export default function AppHeader({ organization, setOrganization }) {
    const [isOpen, setIsOpen] = useState(false);
    const [ shownNotifications, setShownNotifications ] = useState(0);
    const userOrgs = localStorage.getItem('orgs').split(',');
    const username = localStorage.getItem('username');
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    useEffect(() => {
        setOrganization(userOrgs[0]);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setShownNotifications(0);
        }
    };

    function addShownNotifications(toAdd) {
        setShownNotifications(prev => {
            const updatedCount = prev + toAdd;
            return updatedCount >= 0 ? updatedCount : 0; // Ensure it never goes negative
        });
    }

    function handleMenuOpen() {
        if (!isMenuOpen) {
            document.querySelector('.leftBar').style.left = '0';
        } else {
            document.querySelector('.leftBar').style.left = '-70px';
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
                        {userOrgs.map((org) => (
                            <NotificationItems organizationId={org} addShownNotifications={addShownNotifications} />
                        ))}
                        {shownNotifications === 0 && <li>No notifications</li>}
                    </ul>
                </div>
            )}
        </nav>
    );
}