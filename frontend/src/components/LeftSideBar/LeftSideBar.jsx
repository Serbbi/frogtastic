import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useEffect, useState } from "react";
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";
import ConfirmationBox from "../miniComponents/ConfirmationBox";
import SideBarItem from "./SideBarItem";
import { useOrganization } from "../../services/providers/OrganizationProvider";
import './LeftSideBar.css';

export default function LeftSideBar() {
    const { organization, modifyOrganization } = useOrganization();
    const userId = sessionStorage.getItem("userId");
    const isAdmin = JSON.parse(sessionStorage.getItem('privileges'))?.['general_privileges']?.['canGetUsers'];
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const { unsavedChanges, setUnsavedChanges } = useUnsavedChanges();
    const [OrgPic, setOrgPic] = useState("");
    const [confirmationBoxText, setConfirmationBoxText] = useState("");
    const [pendingPath, setPendingPath] = useState(null);

    useEffect(() => {
        if (organization) {
            setOrgPic(organization.logo_url);
        }
    }, [organization]);

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
        sessionStorage.clear();
        modifyOrganization(null);
        navigate("/");
    }

    function handleNavigation(path) {
        if (unsavedChanges) {
            setConfirmationBoxText("You have unsaved changes. Do you really want to leave?");
            setPendingPath(path);
        } else {
            navigate(path);
        }
    }

    return (
        <div className="leftBar" ref={menuRef}>
            <div onClick={() => handleNavigation("/home")} className='organizationNameAndLogo'>
                {organization ? <img src={OrgPic} alt="logo" onError={() => setOrgPic("/org_default_logo.png")} className='logo' /> : null}
                {organization ? <p>{organization.name}</p> : null}
            </div>
            <ul className='menuList'>
                {organization ?
                    <>
                        <SideBarItem icon="frog" label="All Frogs" path="/home/all-frogs" onClick={() => handleNavigation("/home/all-frogs")} />
                        <SideBarItem icon="list" label="Tank Frogs" path="/home/tank-frogs" onClick={() => handleNavigation("/home/tank-frogs")} />
                        <SideBarItem icon="upload" label="Upload Image" path="/home/upload-image" onClick={() => handleNavigation("/home/upload-image")} />
                        <SideBarItem icon="screwdriver-wrench" label="System Parameters" path="/home/system-parameters" onClick={() => handleNavigation("/home/system-parameters")} />
                    </>
                    : null}

                <SideBarItem icon="plus" label="Join Organization" path="/home/join-organization" onClick={() => handleNavigation("/home/join-organization")} />
                {organization && Object.hasOwn(organization, "admins") && organization.admins.includes(Number(userId)) ?
                    <SideBarItem icon="gear" label="Organization Settings" path="/home/organization-settings" onClick={() => handleNavigation("/home/organization-settings")} />
                    : null}
                {isAdmin &&
                    <SideBarItem icon="user-shield" label="Admin Settings" path="/home/admin-settings" onClick={() => handleNavigation("/home/admin-settings")} />
                }
            </ul>
            <button className='logoutButton' onClick={() => logOut()}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /><span>Log Out</span></button>
            {confirmationBoxText && (
                <ConfirmationBox message={confirmationBoxText} onConfirm={() => {
                    if (pendingPath) {
                        navigate(pendingPath);
                        setUnsavedChanges(false);
                    }
                    setConfirmationBoxText("");
                    setPendingPath(null);
                }} onCancel={() => {
                    setConfirmationBoxText("");
                    setPendingPath(null);
                }} />
            )}
        </div>
    );
}