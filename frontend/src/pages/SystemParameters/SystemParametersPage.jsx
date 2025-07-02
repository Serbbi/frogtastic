import './SystemParametersPage.css';
import SystemParametersTable from '../../components/miniComponents/SystemParametersTable';
import { paramDownloadRequest } from '../../services/api/organizations/OrganizationParamsDownload';
import { useNotification } from "../../services/providers/NotificationProvider";

export default function SystemParametersPage({ organization }) {
    const { addNotification } = useNotification();
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

    return (
        <div className="systemParamsContainer">
            <h1 className='title'>System Parameters</h1>
            <SystemParametersTable />
            <button onClick={handleDownload}>Download</button>
        </div>
    );
}