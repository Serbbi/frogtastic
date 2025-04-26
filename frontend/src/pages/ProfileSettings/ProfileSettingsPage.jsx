import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationBox from "../../components/miniComponents/ConfirmationBox";
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";
import { frogsPatchRequest } from "../../services/api/users/UsersPatch"
import { useState } from 'react';
import './ProfileSettingsPage.css';

export default function ProfileSettingsPage() {
    const [confirmationBoxText, setConfirmationBoxText] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const { setUnsavedChanges } = useUnsavedChanges();

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
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        const newUserData = {
            email: email,
            username: username,
            id: localStorage.getItem("userId"),
            organizations: localStorage.getItem("orgs"),
            attributes: JSON.parse(localStorage.getItem("privileges")),
            hashed_password: null // this is here just to make the object complete
        };
        console.log(newUserData);
        // frogsPatchRequest({});
    }

    return (
        <div className="profileSettingsContainer">
            <form>
                <input placeholder={"Username"} value={username} onChange={handleOnChange} className={"profileInput"} name={"username"} />
                <input placeholder={"Email"} value={email} onChange={handleOnChange} className={"profileInput"} name={"email"} />
                <div className={"profilePhotoContainer"} onClick={() => setConfirmationBoxText("This does not do anything yet :)")}>
                    <img src="/user_icon.png" alt="Profile Icon" className={"profilePhotoInput"} />
                    <span className={"profilePhotoHover"}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='profileEditIcon' /></span>
                </div>
                <button onClick={handleSave}>Save</button>
            </form>
            {confirmationBoxText && <ConfirmationBox message={confirmationBoxText} onConfirm={() => setConfirmationBoxText("")} onCancel={() => setConfirmationBoxText("")} />}
        </div>
    )
}