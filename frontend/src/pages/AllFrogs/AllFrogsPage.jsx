import FrogTable from "../../components/miniComponents/FrogTable";
import useFrogs from "../../hooks/useFrogs";
import FrogTableLoading from "../../components/miniComponents/FrogTableLoading";
import { frogDownloadRequest } from "../../services/api/frogs/FrogDownload";
import { useNotification } from "../../services/providers/NotificationProvider";
import './AllFrogsPage.css';

export default function AllFrogsPage({ organization }) {
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, null, null);
    const { addNotification } = useNotification();

    const handleDownload = () => {
        if (organization === null) return;
        frogDownloadRequest(organization.id)
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = `frogs_all.csv`;
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

    if (isLoading || frogs === undefined) return (<FrogTableLoading organization={organization} />);

    return (
        <div className="allFrogsContainer">
            <div className="title-and-buttons">
                <h1 className="title">All Frogs</h1>
                <button onClick={handleDownload} className="primary-button all-frogs-button">Download</button>
            </div>
            {frogs.length === 0 && <h2>No Frogs</h2>}
            {frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization} />}
        </div>
    );
}