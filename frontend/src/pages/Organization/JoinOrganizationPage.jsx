import useOrganizations from '../../hooks/useOrganizations';
import { useNotification } from '../../services/providers/NotificationProvider';
import { useState, useEffect } from 'react';
import { notificationsPostRequest } from '../../services/api/notifications/NotificationsPost';
import CreateOrganizationModal from './CreateOrganizationModal';
import './JoinOrganizationPage.css';

export default function JoinOrganizationPage() {
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');
    const userOrgs = sessionStorage.getItem('orgs').split(',').map(orgId => parseInt(orgId));
    const { organizations, error } = useOrganizations();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const { addNotification } = useNotification();
    const canCreateOrganization = JSON.parse(sessionStorage.getItem('privileges'))?.['general_privileges']?.['canCreateOrganization'];
    const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
    const [orgPics, setOrgPics] = useState([]);

    useEffect(() => {
        if (organizations) {
            const pics = organizations.map(org => org.logo_url);
            setOrgPics(pics);
        }
    }, [organizations]);

    function handleJoin(event) {
        event.preventDefault();

        const notification = {
            title: "Join Request",
            description: `${username} has requested to join ${selectedOrganization.name}`,
            organization_id: selectedOrganization.id,
            user_id: userId
        };

        notificationsPostRequest(notification)
            .then(data => {
                if (data.detail) throw new Error(data.detail);
                if (data.error) throw new Error(data.error);
                addNotification({ text: "Join request sent", type: "success" });
            })
            .catch(error => {
                addNotification({ text: error.message, type: "error" });
            });
        setShowModal(false);
    }

    function handleOpenModal(organization) {
        setSelectedOrganization(organization);
        setShowModal(true);
    }

    if (error) {
        return (
            <div className='joinOrganizationMenu'>
                <h1 className='title'>Join Organization</h1>
                <p className='error'>Error loading organizations: {error.message}</p>
            </div>
        );
    }

    return (
        <div className='joinOrganizationMenu'>
            <div className="title-and-buttons">
                <h1 className='title'>Join Organization</h1>
                {canCreateOrganization && <button onClick={() => setShowCreateOrgModal(true)} className="primary-button all-frogs-button">Create Organization</button>}
            </div>
            <table className='organizationTable'>
                <tbody>
                    {organizations && organizations.map((organization, index) => {
                        const isMember = userOrgs.includes(organization.id);

                        return (
                            <tr
                                key={organization.name}
                                className={`org-table-row ${index % 2 === 0 ? 'even' : 'odd'} ${isMember ? 'disabledRow' : ''}`}
                                onClick={() => {
                                    if (!isMember) handleOpenModal(organization);
                                }}
                            >
                                <td className='logoColumn'>
                                    <img
                                        src={orgPics[index]}
                                        alt="logo"
                                        onError={() => setOrgPics(prev => {
                                            const newPics = [...prev];
                                            newPics[index] = "/org_default_logo.png";
                                            return newPics;
                                        })}
                                        className='organizationLogo'
                                    />
                                </td>
                                <td className='nameColumn'>{organization.name}</td>
                                <td className="membersColumn" >Members: {organization.participants.length}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal && <div className='modalJoinOrg'>
                <div className='modalContentJoinOrg'>
                    <span className='closeJoinOrg' onClick={() => setShowModal(!showModal)}>&times;</span>
                    <h1>Join {selectedOrganization.name}</h1>
                    <p>Are you sure you want to join this organization?</p>
                    <button className='primary-button' onClick={(event) => handleJoin(event)}>Join</button>
                </div>
            </div>}
            <CreateOrganizationModal show={showCreateOrgModal} onClose={() => setShowCreateOrgModal(false)} />
        </div>
    )
}
