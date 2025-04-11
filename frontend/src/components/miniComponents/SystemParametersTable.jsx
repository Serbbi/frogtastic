import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import { useOrganization } from '../../services/providers/OrganizationProvider';
import { useState } from 'react';
import { useUnsavedChanges } from '../../services/providers/UnsavedChangesProvider';
import './SystemParametersTable.css';

export default function SystemParametersTable() {
    const { organization, modifyOrganization } = useOrganization();
    const [editingKey, setEditingKey] = useState(null);
    const { setUnsavedChanges } = useUnsavedChanges();

    function handleAddRow() {
        const dates = Object.keys(organization.system_parameters);
        const lastDate = dates[dates.length - 1];
        const newRow = { ...organization.system_parameters[lastDate] };
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        if (dates.includes(formattedDate)) {
            alert('A row for today already exists');
            return;
        }
        modifyOrganization({ ...organization, system_parameters: { ...organization.system_parameters, [formattedDate]: newRow } });
        setUnsavedChanges(true);
    }

    function handleSave() {
        organizationPutRequest(organization)
            .then(data => console.log(data))
            .catch(error => console.log('Error:', error));

        setUnsavedChanges(false);
    }

    function handleValueChange(event) {
        const value = event.target.value;
        const param = event.target.name;
        const date = event.target.parentElement.parentElement.children[0].innerText;
        const newOrganization = { ...organization };
        newOrganization.system_parameters[date][param] = value;
        modifyOrganization(newOrganization);
        setUnsavedChanges(true);
    }

    const handleKeyChange = (oldKey, newKey) => {
        const newOrganization = { ...organization };
        if (newOrganization.system_parameters.hasOwnProperty(oldKey)) {
            newOrganization.system_parameters[newKey] = newOrganization.system_parameters[oldKey];
            delete newOrganization.system_parameters[oldKey];
            modifyOrganization(newOrganization);
        }
        setUnsavedChanges(true);
    };

    const handleKeyInputChange = (event, oldKey) => {
        const newKey = event.target.value;
        setEditingKey(newKey);
        handleKeyChange(oldKey, newKey);
    };



    if (!organization) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p className='infoText'>Click on the fields in the table to edit them</p>
            <table className='paramsTable'>
                <thead className='tableHead'>
                    <tr>
                        <th>Date</th>
                        {organization && Object.hasOwn(organization, "system_parameter_names") && organization.system_parameter_names.map(param => <th key={param}>{param}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(organization.system_parameters).map(date => (
                        <tr key={date}>
                            <td>
                                {date}
                                {/* <input
                                    name={date}
                                    value={editingKey === date ? editingKey : date}
                                    onChange={(event) => handleKeyInputChange(event, date)}
                                    className='paramInput'
                                /> */}
                            </td>
                            {organization.system_parameter_names.map(param => (
                                <td key={param}>
                                    <input name={param} value={organization.system_parameters[date][param]} onChange={handleValueChange} className='paramInput' />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddRow} className='mainButton'>Add Row</button>
            <button onClick={handleSave} className='mainButton'>Save</button>
        </div>
    );
}