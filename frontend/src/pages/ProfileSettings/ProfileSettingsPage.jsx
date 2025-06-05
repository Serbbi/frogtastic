import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationBox from "../../components/miniComponents/ConfirmationBox";
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";
import { usersPatchRequest } from "../../services/api/users/UsersPatch"
import { useNotification } from "../../services/providers/NotificationProvider";
import useOrganizations from "../../hooks/useOrganizations";
import { validateEmail, validateUsername } from '../../util/validation';
import { useState } from 'react';
import './ProfileSettingsPage.css';

export default function ProfileSettingsPage() {
    const [confirmationBoxText, setConfirmationBoxText] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const { setUnsavedChanges } = useUnsavedChanges();
    const { addNotification } = useNotification();
    const { organizations } = useOrganizations();

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
        console.log(newUserData);
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

    return (
        <div className="profileSettingsContainer">
            <h1 className="title">Profile Settings</h1>
            <form className="userFields">
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="editButton" />
                <div className="profilePicAndInputFields">
                    <div className={"profilePhotoContainer"} onClick={() => setConfirmationBoxText("This does not do anything yet :)")}>
                        <img src="/user_icon.jpg" alt="Profile Icon" className={"profilePhotoInput"} />
                        <span className={"profilePhotoHover"}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='profileEditIcon' /></span>
                    </div>
                    <div className="usernameAndEmailFields">
                        <input placeholder={"Username"} value={username} onChange={handleOnChange} className={"profileInput"} name={"username"} onBlur={validateUsername} />
                        <p className='errorText'></p>
                        <input placeholder={"Email"} value={email} onChange={handleOnChange} className={"profileInput"} name={"email"} onBlur={validateEmail} />
                        <p className='errorText'></p>
                    </div>
                </div>
                <button className="profileSettingsSaveButton" onClick={handleSave}>Save</button>
            </form>
            <form className="userFields">
                <h3>Joined organizations</h3>
                <ul className="organzationsList">
                    {localStorage.getItem("orgs").split(',').map((org, index) => (
                        <li key={index} className="organizationItem">
                            <span className="organizationName">{organizations?.find((organization) => organization.id == org)?.name || "Unknown Organization"}</span>
                            <button className="leaveOrganizationButton" onClick={(e) => {
                                e.preventDefault();
                                setConfirmationBoxText(`Are you sure you want to leave ${organizations?.find((organization) => organization.id == org)?.name} organization?`);
                            }}>Leave</button>
                        </li>
                    ))}
                </ul>
            </form>
            {confirmationBoxText && <ConfirmationBox message={confirmationBoxText} onConfirm={() => setConfirmationBoxText("")} onCancel={() => setConfirmationBoxText("")} />}
        </div>
    )
}