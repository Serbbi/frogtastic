import useUsers from '../../hooks/useUsers';
import useOrganizations from '../../hooks/useOrganizations';
import { usersPutRequest } from '../../services/api/users/UsersPut';
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';

export default function AdminSettingsPage() {
    const { users, mutate } = useUsers();
    const { organizations, mutateOrgs } = useOrganizations();

    async function updateUser(user) {
        const updatedUser = {
            ...user,
            attributes: {
                ...user.attributes,
                general_privileges: {
                    ...user.attributes.general_privileges,
                    canCreateOrganization: !user.attributes.general_privileges.canCreateOrganization
                }
            }
        };

        await usersPutRequest(updatedUser)
            .then(() => {
                mutate();
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    }

    async function saveOrgAdmins() {
        const orgId = document.querySelector('input[placeholder="Organization ID"]').value;
        const adminsIds = document.querySelector('input[placeholder="Admins IDs"]').value.split(',').map(id => parseInt(id.trim()));

        const org = organizations.find(org => org.id == orgId);
        if (org) {
            const updatedOrg = {
                ...org,
                admins: adminsIds
            };

            await organizationPutRequest(updatedOrg)
                .then(() => {
                    mutateOrgs();
                })
                .catch((error) => {
                    console.error('Error updating organization:', error);
                });
        }
    }

    return (
        <div className="settingsMenu">
            <h1 className='title'>Admin Settings</h1>
            <div className="settingsGrid">
                <div className="userList">
                    <h2>User List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Can Create Org.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td><input type="checkbox" checked={user.attributes.general_privileges.canCreateOrganization} onChange={() => updateUser(user)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="organizationList">
                    <h2>Organization List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Org ID</th>
                                <th>Org Name</th>
                                <th>Admins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizations && organizations.map(org => (
                                <tr key={org.id}>
                                    <td>{org.id}</td>
                                    <td>{org.name}</td>
                                    <td>{org.admins.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <input placeholder="Organization ID" />
                    <input placeholder="Admins IDs" />
                    <button onClick={saveOrgAdmins}>Save</button>
                </div>
            </div>
        </div>
    );
}