import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationItems from './NotificationItems';
import useOrganizations from '../../hooks/useOrganizations';
import { useNavigate } from "react-router-dom";
import ExpiredTokenModal from '../miniComponents/ExpiredTokenModal';
import './AppHeader.css';

export default function AppHeader({ setOrganization }) {
    const [isOpen, setIsOpen] = useState(false);
    const [shownNotifications, setShownNotifications] = useState(0);
    const userOrgs = sessionStorage.getItem('orgs').split(',');
    const username = sessionStorage.getItem('username');
    const userEmail = sessionStorage.getItem('email');
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
    const [showOrganizations, setShowOrganizations] = useState(false);
    const { organizations, error } = useOrganizations();
    const [firstTime, setFirstTime] = useState(true);
    const navigate = useNavigate();
    const profileBoxRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const [profilePicSrc, setProfilePicSrc] = useState(`https://storage.googleapis.com/${process.env.REACT_APP_GCS_USER_PROFILE_PICS_LOCATION}/${sessionStorage.getItem('userId')}.jpeg`);

    useEffect(() => {
        setOrganization(userOrgs[0]);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            const clickedOutsideProfile =
                profileBoxRef.current &&
                !profileBoxRef.current.contains(event.target);
            const clickedOutsideNotifications =
                notificationDropdownRef.current &&
                !notificationDropdownRef.current.contains(event.target);

            if (clickedOutsideProfile) {
                setIsProfileSettingsOpen(false);
                profileBoxRef.current.style.maxHeight = '45px';
            }

            if (clickedOutsideNotifications) {
                setIsOpen(false);
                setShownNotifications(0);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileBoxRef]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setShownNotifications(0);
        }
        setFirstTime(false);
    };

    function addShownNotifications(toAdd) {
        setShownNotifications(prev => {
            const updatedCount = prev + toAdd;
            return updatedCount >= 0 ? updatedCount : 0; // Ensure it never goes negative
        });
    }

    function handleMenuOpen() {
        const position = document.querySelector('.leftBar').style.left;

        if (position === '0px') {
            document.querySelector('.leftBar').style.left = '-250px';
        } else {
            document.querySelector('.leftBar').style.left = '0';
        }
    }

    function handleProfileSettingsOpen() {
        if (!isProfileSettingsOpen) {
            profileBoxRef.current.style.maxHeight = '300px';
        } else {
            profileBoxRef.current.style.maxHeight = '45px';  // Collapsed height
            setShowOrganizations(false);
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
                <div className='newDropdown'>
                    <button className='headerButton' onClick={toggleMenu}>
                        <FontAwesomeIcon icon="fa-solid fa-bell" />
                        {firstTime && <span className='notificationBadge'></span>}
                    </button>

                    {isOpen && (
                        <ul className='notificationList' ref={notificationDropdownRef}>
                            {userOrgs[0] !== "" && userOrgs.map((org) => (
                                <NotificationItems key={org} organizationId={org} addShownNotifications={addShownNotifications} />
                            ))}
                            {shownNotifications === 0 && <li key={0}>No notifications</li>}
                        </ul>
                    )}
                </div>
                <button id="menuButton" className='headerButton' onClick={handleMenuOpen}><FontAwesomeIcon icon="fa-solid fa-bars" /></button>
            </div>
            <div className="userContainerAndProfileSettings" ref={profileBoxRef}>
                <div className="userContainer">
                    <img src={profilePicSrc} alt="user-icon" onError={() => setProfilePicSrc("/user_icon.jpg")} className='userIcon' />
                    <div className="userContainerCenter">
                        <p className='userContainerUsername'>{username ? username : 'Username'}</p>
                        <p className='userContainerEmail'>{userEmail}</p>
                    </div>
                    {isProfileSettingsOpen ? <FontAwesomeIcon icon="fa-solid fa-chevron-up" className='userContainerChevron' onClick={handleProfileSettingsOpen} /> :
                        <FontAwesomeIcon icon="fa-solid fa-chevron-down" className='userContainerChevron' onClick={handleProfileSettingsOpen} />}
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
                            {organizations && organizations.length !== 0 && userOrgs.map((org) => (
                                <button key={org} className='profileSettingsButton' onClick={() => setOrganization(org)}>{getOrganizationName(Number(org))}</button>
                            ))}
                            <button className='profileSettingsButton' onClick={() => setShowOrganizations(false)}>Back</button>
                        </>
                    }
                </div>
            </div>
            {error && error.toString().includes('Token') && <ExpiredTokenModal />}
        </nav>
    );
}
