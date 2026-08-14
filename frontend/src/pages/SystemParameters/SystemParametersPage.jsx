import SystemParametersTable from './SystemParametersTable';
import { useNotification } from "../../services/providers/NotificationProvider";
import { useOrganization } from '../../services/providers/OrganizationProvider';
import { useUnsavedChanges } from '../../services/providers/UnsavedChangesProvider';
import './SystemParametersPage.css';
import { useState } from 'react';
import { systemParametersPutRequest } from '../../services/api/system_parameters/SystemParametersPut';
import useSystemParameters from '../../hooks/useSystemParameters';
import { systemParametersPostRequest } from '../../services/api/system_parameters/SystemParametersPost';
import { systemParametersDeleteRequest } from '../../services/api/system_parameters/SystemParametersDelete';
import { systemParametersDownloadRequest } from '../../services/api/system_parameters/SystemParametersDownload';

export default function SystemParametersPage() {
    const { addNotification } = useNotification();
    const { setUnsavedChanges } = useUnsavedChanges();
    const { organization } = useOrganization();
    const { systemParameters, setSystemParameters } = useSystemParameters(organization?.id);
    const [dirtyRows, setDirtyRows] = useState({});
    const [selectedRows, setSelectedRows] = useState(new Set());

    const handleDownload = () => {
        if (organization === null) return;
        systemParametersDownloadRequest(organization.id)
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
            .catch(() => addNotification({ text: "Error downloading file", type: "error" }));
    };

    function handleAddRow() {
        if (organization === null) return;

        let newRow = {};
        organization.system_parameter_names.forEach(element => {
            newRow[element] = ""
        });

        systemParametersPostRequest(organization.id, newRow)
            .then((createdRow) => {
                addNotification({ text: "Row added!", type: "success" });
                setSystemParameters(prev => [...prev, createdRow]);
            })
            .catch((error) => addNotification({ text: error.message, type: "error" }));
    }

    function handleSave() {
        if (Object.values(dirtyRows).length === 0) {
            addNotification({ text: "No parameters were changed!", type: "warning" });
            return;
        }

        systemParametersPutRequest(Object.values(dirtyRows), organization.id)
            .then(() => {
                addNotification({ text: "Parameters saved successfully!", type: "success" });
                setDirtyRows({});
            })
            .catch((error) => addNotification({ text: error.message, type: "error" }));
        
        setUnsavedChanges(false);
    }

    async function handleDelete() {
        if (selectedRows.size === 0) {
            addNotification({ text: "No rows selected!", type: "warning" });
            return;
        }

        const idsToDelete = Array.from(selectedRows);

        setDirtyRows(prev => {
            const copy = { ...prev };
            idsToDelete.forEach(id => delete copy[id]);
            return copy;
        });

        systemParametersDeleteRequest(idsToDelete, organization.id)
            .then(() => {
                addNotification({ text: "Rows deleted successfully!", type: "success" });
                setSelectedRows(new Set());
                setSystemParameters(prev => prev.filter(row => !idsToDelete.includes(row.id)));
            })
            .catch((error) => addNotification({ text: error.message, type: "error" }));
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
                    <button onClick={handleDelete} className="primary-button all-frogs-button" disabled={Array.from(selectedRows).length === 0}>Delete</button>
                </div>
            </div>
            {organization && 
            <SystemParametersTable 
                systemParameters={systemParameters} 
                setSystemParameters={setSystemParameters} 
                setDirtyRows={setDirtyRows} 
                systemParameterNames={organization?.system_parameter_names ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}    
            />
            }
        </div>
    );
}