import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useEffect } from "react";
import './LeftSideBar.css';
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";

export default function LeftSideBar({ organization, setOrganization }) {
    const userId = localStorage.getItem("userId");
    const canCreateOrganization = JSON.parse(localStorage.getItem('privileges'))['general_privileges']['canCreateOrganization'];
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const { unsavedChanges, setUnsavedChanges } = useUnsavedChanges();

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

    function handleNavigation(path) {
        if (unsavedChanges) {
            const confirmLeave = window.confirm("You have unsaved changes. Do you really want to leave?");
            if (!confirmLeave) return;
            setUnsavedChanges(false);
        }
        navigate(path);
    }

    const isActive = (path) => window.location.pathname === path;

    return (
        <div className="leftBar" ref={menuRef}>
            <div className='organizationNameAndLogo'>
                {organization ? <img src="/frog_logo.jpg" alt="logo" className='logo' /> : null}
                {organization ? <p>{organization.name}</p> : null}
            </div>
            <ul className='menuList'>
                {organization ?
                    <>
                        <li
                            onClick={() => handleNavigation("/home/all-frogs")}
                            className={`navLink${isActive("/home/all-frogs") ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="frog" className='menuIcon' />
                            <span>All Frogs</span>
                        </li>
                        <li
                            onClick={() => handleNavigation("/home/tank-frogs")}
                            className={`navLink${isActive("/home/tank-frogs") ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="list" className='menuIcon' />
                            <span>Tank Frogs</span>
                        </li>
                        <li
                            onClick={() => handleNavigation("/home/upload-image")}
                            className={`navLink${isActive("/home/upload-image") ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="upload" className='menuIcon' />
                            <span>Upload Image</span>
                        </li>
                        <li
                            onClick={() => handleNavigation("/home/system-parameters")}
                            className={`navLink${isActive("/home/system-parameters") ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='menuIcon' />
                            <span>System Parameters</span>
                        </li>
                    </>
                    : null}

                <li
                    onClick={() => handleNavigation("/home/join-organization")}
                    className={`navLink${isActive("/home/join-organization") ? "active" : ""}`}
                >
                    <FontAwesomeIcon icon="plus" className='menuIcon' />
                    <span>Join Organization</span>
                </li>
                {canCreateOrganization ?
                    <li
                        onClick={() => handleNavigation("/home/create-organization")}
                        className={`navLink${isActive("/home/create-organization") ? "active" : ""}`}
                    >
                        <FontAwesomeIcon icon="building" className='menuIcon' />
                        <span>Create Organization</span>
                    </li>
                    : null}
                {organization && Object.hasOwn(organization, "admins") && organization.admins.includes(Number(userId)) ?
                    <li
                        onClick={() => handleNavigation("/home/organization-settings")}
                        className={`navLink${isActive("/home/organization-settings") ? "active" : ""}`}
                    >
                        <FontAwesomeIcon icon="gear" className='menuIcon' />
                        <span>Organization Settings</span>
                    </li>
                    : null}
            </ul>
            <button className='logoutButton' onClick={() => logOut()}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /><span>Log Out</span></button>
        </div>
    );
}