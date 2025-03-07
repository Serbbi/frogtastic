import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import './SystemParametersPage.css';
import SystemParametersTable from '../../components/miniComponents/SystemParametersTable';

export default function SystemParametersPage({ organization }) {
    const [ modifiedOrganization, setModifiedOrganization ] = useState(organization);
    const [ showCreateCard, setShowCreateCard ] = useState(false);
    const [ newParam, setNewParam ] = useState({ name: '', value: '' });

    useEffect(() => {
        if (organization) {
            setModifiedOrganization(organization);
        }
    }, [organization]);

    function formatLabel(label) {
        return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function updateField(event) {
        const name = event.target.name;
        const value = event.target.value;

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: { ...prevOrganization.system_parameters, [name]: value } }));
    }

    function updateNewParam(event) {
        const name = event.target.name;
        const value = event.target.value;
    
        setNewParam({ ...newParam, [name]: value });
    }

    function handleShowCreateCard() {
        setShowCreateCard(true);
    }

    function handleAddNewParam() {
        if (newParam.name === '' || newParam.value === '') {
            return;
        }
        organizationPutRequest({ ...modifiedOrganization, system_parameters: { ...modifiedOrganization.system_parameters, [newParam.name]: newParam.value } })
        .then(data => console.log(data))
        .catch(error => console.log('Error:', error));

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: { ...prevOrganization.system_parameters, [newParam.name]: newParam.value } }));
        setNewParam({ name: '', value: '' });
        setShowCreateCard(false);
    }

    function handleDeleteParam(name) {
        if (!window.confirm(`Are you sure you want to delete the parameter ${name}?`)) {
            return;
        }

        const newParams = { ...modifiedOrganization.system_parameters };
        delete newParams[name];

        organizationPutRequest({ ...modifiedOrganization, system_parameters: newParams })
        .then(data => console.log(data))
        .catch(error => console.log('Error:', error));

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: newParams }));
    }

    return (
        <div className="systemParamsContainer">
            <h1 className='title'>System Parameters</h1>
            <SystemParametersTable />
        </div>
    );
}