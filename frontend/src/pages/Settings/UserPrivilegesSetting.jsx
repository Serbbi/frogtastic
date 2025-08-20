import useUsers from "../../hooks/useUsers";
import { useState } from "react";
import { usersPutRequest } from "../../services/api/users/UsersPut";
import './SettingsPage.css';

export default function UserPrivilegesSetting({ organizationId }) {
    const { users, mutate: mutateUsers } = useUsers(organizationId);
    const [selectedUser, setSelectedUser] = useState(null);
    const userId = sessionStorage.getItem('userId');

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

    async function handleSave() {
        try {
            const data = await usersPutRequest(selectedUser, organizationId);
            console.log(data);

            await mutateUsers((users) =>
                users.map(user =>
                    user.id === selectedUser.id ? { ...user, ...selectedUser } : user
                ),
                false
            );
        } catch (error) {
            console.error(error);
        }
    }

    function handleSelectUser(user) {
        if (selectedUser !== null && selectedUser.id === user.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
        }
    }

    return (
        <div className='settingContainer'>
            <h3>User Access Rights</h3>
            <div className="usersAndPrivileges">
                <ul className="userList">
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
                    <div className="userPrivilegesList">
                        {Object.keys(selectedUser.attributes[organizationId]).map(attribute => (
                            <div key={attribute} className="privilegeItem">
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
            {/* <div className="settingButtons"> */}
            <button onClick={handleSave}>Save</button>
            {/* </div> */}
        </div>
    );
}
