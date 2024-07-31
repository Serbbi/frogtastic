import PropTypes from 'prop-types';
import Loading from '../miniComponents/loading';
import './UserDetailsContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUser from '../../hooks/useUser';

export default function UserDetailsContent({ id, goBackAction }) {
    const token = localStorage.getItem('site');
    const { user, isLoading, mutate } = useUser({ id });

    function changePrivileges(privilege) {
        mutate({ ...user, privileges: { ...user.privileges, [privilege]: !user.privileges[privilege] }}, false);
    }

    function saveUser() {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function deleteUser() {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.reload();
                goBackAction(); 
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    if (isLoading) return <Loading />;

    return (
        <div className='userDetailsContainer'>
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={goBackAction} className="goBackButton" />
            <h1>User Details</h1>
            <p><em>Username: </em>{user.username}</p>
            <p>Privileges:</p>
            <div className='privilegeField'>
                <label htmlFor="canEditFrogs" className='privilegeLabel'>Can Edit Frogs</label>
                <input
                    id="canEditFrogs"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canEditFrogs}
                    onChange={() => changePrivileges('canEditFrogs')}
                />
            </div>
            <div className='privilegeField'>
                <label htmlFor="canCreateFrogs" className='privilegeLabel'>Can Create Frogs</label>
                <input
                    id="canCreateFrogs"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canCreateFrogs}
                    onChange={() => changePrivileges('canCreateFrogs')}
                />
            </div>
            <div className='privilegeField'>
                <label htmlFor="canDeleteFrogs" className='privilegeLabel'>Can Delete Frogs</label>
                <input
                    id="canDeleteFrogs"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canDeleteFrogs}
                    onChange={() => changePrivileges('canDeleteFrogs')}
                />
            </div>
            <div className='privilegeField'>
                <label htmlFor="canEditUsers" className='privilegeLabel'>Can Edit Users</label>
                <input
                    id="canEditUsers"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canEditUsers}
                    onChange={() => changePrivileges('canEditUsers')}
                />
            </div>
            <div className='privilegeField'>
                <label htmlFor="canCreateUsers" className='privilegeLabel'>Can Create Users</label>
                <input
                    id="canCreateUsers"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canCreateUsers}
                    onChange={() => changePrivileges('canCreateUsers')}
                />
            </div>
            <div className='privilegeField'>
                <label htmlFor="canDeleteUsers" className='privilegeLabel'>Can Delete Users</label>
                <input
                    id="canDeleteUsers"
                    className='privilegeCheckbox'
                    type="checkbox"
                    checked={user.privileges.canDeleteUsers}
                    onChange={() => changePrivileges('canDeleteUsers')}
                />
            </div>
            <button onClick={saveUser}>Save</button>
            <button onClick={deleteUser}>Delete</button>
        </div>
    );
};

UserDetailsContent.propTypes = {
    id: PropTypes.number.isRequired,
    goBackAction: PropTypes.func.isRequired
};