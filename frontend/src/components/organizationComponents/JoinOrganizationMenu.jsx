import useOrganizations from '../../hooks/useOrganizations';
import { useNotification } from '../../hooks/NotificationProvider';
import './JoinOrganizationMenu.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function JoinOrganizationMenu() {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const { organizations } = useOrganizations();
    const [ showModal, setShowModal ] = useState(false);
    const [ selectedOrganization, setSelectedOrganization ] = useState(null);
    const { addNotification } = useNotification();
    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    async function postRequest(notification) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification)
        });

        return await response.json();
    }

    function handleJoin(event) {
        event.preventDefault();

        const notification = {
            title: "Join Request",
            description: `${username} has requested to join ${selectedOrganization.name}`,
            organization_id: selectedOrganization.id,
            user_id: userId
        };

        postRequest(notification)
            .then(data => {
                console.log(data);
                if (data.detail) throw new Error(data.detail);
                if (data.error) throw new Error(data.error);
                addNotification({ text: "Join request sent", type: "success" });
            })
            .catch(error => {
                addNotification({ text: error.message, type: "error" });
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
            <h1 className='title'>Join Organization</h1>
            <table className='organizationTable'>
                <tbody>
                    {organizations && organizations.map((organization, index) => (
                        <tr key={organization.name} className={index % 2 === 0 ? 'even' : 'odd'} onClick={() => handleOpenModal(organization)}>
                            <td className='logoColumn'><img src='/Designer.jpeg' alt='Logo' className='organizationLogo'/></td>
                            <td className='nameColumn'>{organization.name}</td>
                            <td className='descriptionColumn'><p>{description.length > 100 ? `${description.slice(0, 100)}...` : description}</p></td>
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
