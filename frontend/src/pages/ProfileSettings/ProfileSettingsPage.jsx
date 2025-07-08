import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationBox from "../../components/miniComponents/ConfirmationBox";
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";
import { usersPatchRequest } from "../../services/api/users/UsersPatch"
import { useNotification } from "../../services/providers/NotificationProvider";
import useOrganizations from "../../hooks/useOrganizations";
import { validateEmail, validateUsername } from '../../util/validation';
import { useState, useEffect, useRef } from 'react';
import './ProfileSettingsPage.css';
import { organizationQuitRequest } from '../../services/api/organizations/OrganizationQuit';

export default function ProfileSettingsPage() {
    const [confirmationBoxText, setConfirmationBoxText] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [isEditing, setIsEditing] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeOrganization, setActiveOrganization] = useState(null);
    const { setUnsavedChanges } = useUnsavedChanges();
    const { addNotification } = useNotification();
    const { organizations } = useOrganizations();
    const dropdownRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    function handleOnChange(event) {
        setUnsavedChanges(true);
        if (event.target.name === "username") {
            setUsername(event.target.value);
        } else if (event.target.name === "email") {
            setEmail(event.target.value);
        }
    }

    function handleSave(event) {
        event.preventDefault();
        setUnsavedChanges(false);
        const newUserData = {
            email: email,
            username: username,
            id: localStorage.getItem("userId"),
            organizations: localStorage.getItem("orgs").split(','),
            attributes: {},
            hashed_password: "" // this is here just to make the object complete
        };
        usersPatchRequest(newUserData)
            .then(() => {
                localStorage.setItem("email", email);
                localStorage.setItem("username", username);
                window.location.reload();
            })
            .catch(() => {
                addNotification({ text: "Failed to update profile. Please try again.", type: "error" });
            });
    }

    function handleQuitOrganization() {
        organizationQuitRequest(activeOrganization)
            .then(() => {
                const orgs = localStorage.getItem("orgs").split(',').filter(org => org !== activeOrganization);
                localStorage.setItem("orgs", orgs.join(','));
                addNotification({ text: "Successfully left the organization.", type: "success" });
                window.location.reload();
            })
            .catch(() => {
                addNotification({ text: "Failed to leave the organization. Please try again.", type: "error" });
            });
        setConfirmationBoxText("");
        setActiveDropdown(null);
        setActiveOrganization(null);
    }

    return (
        <div className="profileSettingsContainer">
            <h1 className="title">Profile Settings</h1>
            <form className="userFields">
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="editButton" onClick={() => setIsEditing(!isEditing)} />
                <div className="profilePicAndInputFields">
                    <div className={"profilePhotoContainer"}>
                        <img src="/user_icon.jpg" alt="Profile Icon" className={"profilePhotoInput"} />
                        {isEditing && <span className={"profilePhotoHover"} onClick={() => setConfirmationBoxText("This does not do anything yet :)")}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='profileEditIcon' /></span>}
                    </div>
                    <div className="usernameAndEmailFields">
                        <label className="profile-form-label">Username</label>
                        <input placeholder={"Username"} value={username} onChange={handleOnChange} className={"profileInput"} name={"username"} onBlur={validateUsername} disabled={!isEditing} />
                        <p className='errorText'></p>
                        <label className="profile-form-label">Email</label>
                        <input placeholder={"Email"} value={email} onChange={handleOnChange} className={"profileInput"} name={"email"} onBlur={validateEmail} disabled={!isEditing} />
                        <p className='errorText'></p>
                    </div>
                </div>
                {isEditing && <button className="primary-button profileSettingsSaveButton" onClick={handleSave}>Save</button>}
            </form>
            <form className="userFields">
                <h2>Joined organizations</h2>
                <ul className="organzationsList">
                    {localStorage.getItem("orgs").split(',').map((org, index) => (
                        <li key={index} className="organizationItem">
                            <span className="organizationName">{organizations?.find((organization) => organization.id == org)?.name || "Unknown Organization"}</span>
                            {/* <button className="leaveOrganizationButton" onClick={(e) => {
                                e.preventDefault();
                                setConfirmationBoxText(`Are you sure you want to leave ${organizations?.find((organization) => organization.id == org)?.name} organization?`);
                            }}>Leave</button> */}
                            <span className="org-item-options-outer" onClick={() => { setActiveDropdown(activeDropdown === org ? null : org); setActiveOrganization(org); }}>
                                <FontAwesomeIcon icon="fa-solid fa-ellipsis" className="org-item-options" />
                                {activeDropdown === org && (
                                    <div className="dropdownMenu" ref={dropdownRef}>
                                        <button className="dropdownItem" onClick={() => {
                                            setConfirmationBoxText(`Are you sure you want to leave organization?`);
                                        }}>
                                            Leave Organization
                                        </button>
                                    </div>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </form>
            {confirmationBoxText && <ConfirmationBox message={confirmationBoxText} onConfirm={() => handleQuitOrganization()} onCancel={() => setConfirmationBoxText("")} />}
        </div>
    )
}