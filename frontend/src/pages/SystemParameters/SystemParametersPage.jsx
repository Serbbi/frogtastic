import SystemParametersTable from './SystemParametersTable';
import { paramDownloadRequest } from '../../services/api/organizations/OrganizationParamsDownload';
import { useNotification } from "../../services/providers/NotificationProvider";
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import { useOrganization } from '../../services/providers/OrganizationProvider';
import { useUnsavedChanges } from '../../services/providers/UnsavedChangesProvider';
import './SystemParametersPage.css';

export default function SystemParametersPage({ organization }) {
    const { addNotification } = useNotification();
    const { setUnsavedChanges } = useUnsavedChanges();
    const { modifyOrganization } = useOrganization();

    const handleDownload = () => {
        paramDownloadRequest(organization.id)
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = `system_parameters.csv`;
                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Download error:', error);
                addNotification({ text: "Error downloading file", type: "error" });
            });
    };

    function handleAddRow() {
        const dates = Object.keys(organization.system_parameters);
        const lastDate = dates[dates.length - 1];
        const newRow = { ...organization.system_parameters[lastDate] };
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        if (dates.includes(formattedDate)) {
            addNotification({ text: "A row for today already exists!", type: "error" });
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

    return (
        <div className="systemParamsContainer">
            <div className="title-and-buttons">
                <div className="title-and-subtitle">
                    <h1 className='title'>System Parameters</h1>
                    <p className='infoText'>Click on the fields in the table to edit them</p>
                </div>
                <div className="right-side-buttons">
                    <button onClick={handleDownload} className="primary-button all-frogs-button">Download</button>
                    <button onClick={handleAddRow} className="primary-button all-frogs-button">Add Row</button>
                    <button onClick={handleSave} className="primary-button all-frogs-button">Save</button>
                </div>
            </div>
            <SystemParametersTable />
        </div>
    );
}