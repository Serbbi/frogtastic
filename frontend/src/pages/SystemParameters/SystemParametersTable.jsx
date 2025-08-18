import { useOrganization } from '../../services/providers/OrganizationProvider';
import { useUnsavedChanges } from '../../services/providers/UnsavedChangesProvider';
import './SystemParametersTable.css';

export default function SystemParametersTable() {
    const { organization, modifyOrganization } = useOrganization();
    const { setUnsavedChanges } = useUnsavedChanges();

    function handleValueChange(event) {
        const value = event.target.value;
        const param = event.target.name;
        const date = event.target.parentElement.parentElement.children[0].innerText;
        const newOrganization = { ...organization };
        newOrganization.system_parameters[date][param] = value;
        modifyOrganization(newOrganization);
        setUnsavedChanges(true);
    }

    if (!organization) {
        return <div>Loading...</div>;
    }

    return (
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
                        <td>{date}</td>
                        {organization.system_parameter_names.map(param => (
                            <td key={param}>
                                <input name={param} value={organization.system_parameters[date][param]} onChange={handleValueChange} className='paramInput' />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}