import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useEffect } from "react";
import './LeftSideBar.css';

export default function LeftSideBar({ organization, setOrganization }) {
    const userId = localStorage.getItem("userId");
    const canCreateOrganization = JSON.parse(localStorage.getItem('privileges'))['general_privileges']['canCreateOrganization'];
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target))
                document.querySelector('.leftBar').style.left = '-250px';
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    function logOut() {
        localStorage.clear();
        setOrganization(-1);
        navigate("/");
    }

    return (
        <div className="leftBar" ref={menuRef}>
            <div className='organizationNameAndLogo'>
                {organization ? <img src="/frog_logo.jpg" alt="logo" className='logo'/> : null}
                {organization ? <p>{organization.name}</p> : null}
            </div>
            <ul className='menuList'>
                {organization ? 
                    <>
                    <li>
                        <NavLink to="/home/all-frogs" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="frog" className='menuIcon'/>
                            <span>All Frogs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/tank-frogs" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="list" className='menuIcon'/>
                            <span>Tank Frogs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/upload-image" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="upload" className='menuIcon'/>
                            <span>Upload Image</span>
                        </NavLink>
                    </li>                    
                    <li>
                        <NavLink to="/home/system-parameters" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='menuIcon'/>
                            <span>System Parameters</span>
                        </NavLink>
                    </li>
                    </>
                 : null} 
            
                <li>
                    <NavLink to="/home/join-organization" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                        <FontAwesomeIcon icon="plus" className='menuIcon'/>
                        <span>Join Organization</span>
                    </NavLink>
                </li>
                {canCreateOrganization ?
                    <li>
                        <NavLink to="/home/create-organization" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="building" className='menuIcon'/>
                            <span>Create Organization</span>
                        </NavLink>
                    </li>
                : null}
                {organization && organization.admins.includes(Number(userId)) ?
                    <li>
                        <NavLink to="/home/organization-settings" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
                            <FontAwesomeIcon icon="gear" className='menuIcon'/>
                            <span>Organization Settings</span>
                        </NavLink>
                    </li>
                : null}
            </ul>
            <button className='logoutButton' onClick={() => logOut()}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /><span>Log Out</span></button>
        </div>
    );
}