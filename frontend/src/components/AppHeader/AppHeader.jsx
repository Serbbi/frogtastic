import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationItems from './NotificationItems';
import useOrganizations from '../../hooks/useOrganizations';
import { useNavigate } from "react-router-dom";
import './AppHeader.css';

export default function AppHeader({ organization, setOrganization }) {
    const [isOpen, setIsOpen] = useState(false);
    const [ shownNotifications, setShownNotifications ] = useState(0);
    const userOrgs = localStorage.getItem('orgs').split(',');
    const username = localStorage.getItem('username');
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isProfileSettingsOpen, setIsProfileSettingsOpen ] = useState(false);
    const userContainer = document.querySelector('.userContainerAndProfileSettings');
    const [ showOrganizations, setShowOrganizations ] = useState(false);
    const { organizations } = useOrganizations();
    const navigate = useNavigate();

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

    function handleProfileSettingsOpen() {
        if (!isProfileSettingsOpen) {
            userContainer.style.maxHeight = '300px';
        } else {
            userContainer.style.maxHeight = '45px';  // Collapsed height
        }
        setIsProfileSettingsOpen(!isProfileSettingsOpen);
    }

    function getOrganizationName(orgId) {
        for (let org of organizations) {
            if (org.id === orgId) {
                return org.name;
            }
        }
    }

    return (
        <nav className="appHeader">
            <div className="buttons">
                <button className='headerButton' onClick={() => navigate('/home/help')}>?</button>
                {/* {userOrgs.length > 1 ? <button className='headerButton'>Organizations</button> : null} */}
                <div className='newDropdown'>
                    <button className='headerButton' onClick={toggleMenu}><FontAwesomeIcon icon="fa-solid fa-bell" /></button>
                    {isOpen && (
                            <ul className='notificationList'>
                                {userOrgs.map((org) => (
                                    <NotificationItems organizationId={org} addShownNotifications={addShownNotifications} />
                                ))}
                                {shownNotifications === 0 && <li key={0}>No notifications</li>}
                            </ul>
                    )}
                </div>
                <button id="menuButton" className='headerButton' onClick={handleMenuOpen}><FontAwesomeIcon icon="fa-solid fa-bars"/></button>
            </div>
            <div className="userContainerAndProfileSettings">
                <div className="userContainer">
                    <img src="/user_icon.png" alt="user-icon" className='userIcon'/>
                    <div className="userContainerCenter">
                        <p className='userContainerUsername'>{username ? username : 'Username'}</p>
                        <p className='userContainerEmail'>tonieserban@yahoo.ro</p>
                    </div>
                    {isProfileSettingsOpen ? <FontAwesomeIcon icon="fa-solid fa-chevron-up" className='userContainerChevron' onClick={handleProfileSettingsOpen}/> :
                    <FontAwesomeIcon icon="fa-solid fa-chevron-down" className='userContainerChevron' onClick={handleProfileSettingsOpen}/>}
                </div>
                <div className="profileSettings">
                    {!showOrganizations && 
                        <>
                        <button className='profileSettingsButton' onClick={() => navigate(`/home/profile-settings/${username}`)}>Profile Settings</button>
                        <button className='profileSettingsButton' onClick={() => setShowOrganizations(true)}>Organizations</button>
                        {/* <button className='profileSettingsButton'>Logout</button> */}
                        </>
                    }
                    {showOrganizations &&
                    <>
                        {userOrgs.map((org) => (
                            <button className='profileSettingsButton' onClick={() => setOrganization(org)}>{getOrganizationName(Number(org))}</button>
                        ))}
                        <button className='profileSettingsButton' onClick={() => setShowOrganizations(false)}>Back</button>
                    </>
                    }
                </div>
            </div>
        </nav>
    );
}