import useUsers from "../../hooks/useUsers";
import { useState } from "react";
import { usersPutRequest } from "../../services/api/users/UsersPut";
import { useNotification } from "../../services/providers/NotificationProvider";
import './SettingsPage.css';

export default function UserPrivilegesSetting({ organizationId }) {
    const { users, mutate: mutateUsers } = useUsers(organizationId);
    const [selectedUser, setSelectedUser] = useState(null);
    const userId = sessionStorage.getItem('userId');
    const { addNotification } = useNotification();

    function handleAttributeChange(event) {
        const attribute = event.target.previousSibling.textContent;
        const value = event.target.checked;
        setSelectedUser(prevState => {
            return {
                ...prevState,
                attributes: {
                    ...prevState.attributes,
                    [organizationId]: {
                        ...prevState.attributes[organizationId],
                        [attribute]: value
                    }
                }
            };
        });
    }

    function handleSave() {
        usersPutRequest(selectedUser, organizationId)
            .then(() => {
                mutateUsers((users) =>
                    users.map(user =>
                        user.id === selectedUser.id ? { ...user, ...selectedUser } : user
                    ),
                    false
                );
                addNotification({ text: "User updated successfully!", type: "success" })
            })
            .catch((error) => addNotification({ text: error.message, type: "error" }));
    }

    function handleSelectUser(user) {
        if (selectedUser !== null && selectedUser.id === user.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
            const settingContent = document.querySelector('.users-and-privileges').closest('.setting-section-content');
            if (settingContent) {
                settingContent.style.height = 'auto';
            }
        }
    }

    return (
        <>
            <div className="users-and-privileges">
                {users && users.length === 1 && <p>No other users found.</p>}
                <ul className="user-list">
                    {users && users.map(user => {
                        if (user.id.toString() === userId) return null;
                        return (
                            <li
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className={`user-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}                            >
                                {user.username}
                            </li>
                        );
                    })}
                </ul>
                {selectedUser && (
                    <div className="use-privileges-list">
                        {Object.keys(selectedUser.attributes[organizationId]).filter(attribute => !["canGetUsers", "canEditUsers", "canDeleteUsers"].includes(attribute)).map(attribute => (
                            <div key={attribute} className="privilege-item">
                                <span>{attribute}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedUser.attributes[organizationId][attribute]}
                                    onChange={handleAttributeChange}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="setting-buttons">
                <p></p>
                <button className="setting-button save" onClick={handleSave}>Save</button>
            </div>
        </>
    );
}
