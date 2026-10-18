import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useOrganizations from '../../hooks/useOrganizations';
import { useNavigate } from "react-router-dom";
import ExpiredTokenModal from '../miniComponents/ExpiredTokenModal';
import NotificationDropdownAndButton from './NotificationDropdownAndButton';
import { useOrganization } from '../../services/providers/OrganizationProvider';
import './AppHeader.css';

export default function AppHeader() {
    const { setOrganization } = useOrganization();
    const userOrgs = sessionStorage.getItem('orgs').split(',');
    const username = sessionStorage.getItem('username');
    const userEmail = sessionStorage.getItem('email');
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
    const [showOrganizations, setShowOrganizations] = useState(false);
    const { organizations, error } = useOrganizations();
    const navigate = useNavigate();
    const profileBoxRef = useRef(null);
    const [profilePicSrc, setProfilePicSrc] = useState(`${sessionStorage.getItem('userProfilePic')}`);

    useEffect(() => {
        const selectedOrg = sessionStorage.getItem("selectedOrg");
        if (!selectedOrg) {
            setOrganization(userOrgs[0]);
        } else {
            setOrganization(selectedOrg);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileBoxRef.current && !profileBoxRef.current.contains(event.target)) {
                setIsProfileSettingsOpen(false);
                profileBoxRef.current.style.maxHeight = '45px';
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileBoxRef]);

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
                <NotificationDropdownAndButton organizationId={sessionStorage.getItem("selectedOrg")} />
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
