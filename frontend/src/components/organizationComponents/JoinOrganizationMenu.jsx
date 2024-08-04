import useAllOrganizations from '../../hooks/useAllOrganizations';
import { useNotification } from '../../hooks/NotificationProvider';
import './JoinOrganizationMenu.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function JoinOrganizationMenu() {
    const token = localStorage.getItem('site');
    const { organizations, isLoading } = useAllOrganizations();
    const [ showModal, setShowModal ] = useState(false);
    const [ selectedOrganization, setSelectedOrganization ] = useState(null);
    const { addNotification } = useNotification();
    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    async function putRequest(organizationName) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/Join Request/${organizationName}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST'
        });

        return await response.json();
    }

    function handleJoin(event) {
        event.preventDefault();

        putRequest(selectedOrganization.name)
            .then(data => {
                if (data.error) throw new Error(data.error);
                addNotification({ id: uuidv4(), text: "Join request sent", type: "success" });
                console.log(data);
            })
            .catch(error => {
                addNotification({ id: uuidv4(), text: error.message, type: "error" });
                console.error(error);
            });
        setShowModal(false);
    }

    function handleOpenModal(organization) {
        setSelectedOrganization(organization);
        setShowModal(true);
    }

    return (
        <div className='joinOrganizationMenu'>
            <h1>Join Organization</h1>
            <table className='organizationTable'>
                <tbody>
                    {organizations && organizations.map((organization, index) => (
                        <tr key={organization.name} className={index % 2 === 0 ? 'even' : 'odd'} onClick={() => handleOpenModal(organization)}>
                            <td className='logoColumn'><img src='/Designer.jpeg' alt='Logo' className='organizationLogo'/></td>
                            <td className='nameColumn'>{organization.name}</td>
                            <td className='descriptionColumn'>{description.length > 100 ? `${description.slice(0, 100)}...` : description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && <div className='modalJoinOrg'>
                <div className='modalContentJoinOrg'>
                    <span className='closeJoinOrg' onClick={() => setShowModal(!showModal)}>&times;</span>
                    <h1>Join {selectedOrganization.name}</h1>
                    <p>Are you sure you want to join this organization?</p>
                    <button className='joinButton' onClick={(event) => handleJoin(event)}>Join</button>
                </div>
            </div>}
        </div>
    )
}
