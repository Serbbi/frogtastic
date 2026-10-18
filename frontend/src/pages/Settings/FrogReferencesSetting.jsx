import { useState } from "react";
import JSZip from "jszip";
import { useOrganization } from "../../services/providers/OrganizationProvider";
import { imagePostBulkUploadReferences } from "../../services/api/image/ImagePost";
import { useNotification } from "../../services/providers/NotificationProvider";
import { frogsPostRequest } from "../../services/api/frogs/FrogsPost";
import './SettingsPage.css';

export default function FrogReferencesSetting() {
    const { organization } = useOrganization();
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const { addNotification } = useNotification();

    const regex = /^frog\d+_tank\d+\.(png|jpg|jpeg)$/i;

    const handleFileChange = async (e) => {
        const zipFile = e.target.files[0];
        if (!zipFile) return;

        if (!zipFile.name.endsWith(".zip")) {
            setError("Please upload a ZIP file.");
            return;
        }

        const zip = await JSZip.loadAsync(zipFile);
        const fileNames = Object.keys(zip.files)
            .filter(name => !zip.files[name].dir); // ignore folders

        const invalidFiles = fileNames.filter(name => {
            const baseName = name.split("/").pop(); // remove subfolder paths
            return !regex.test(baseName);
        });

        if (invalidFiles.length > 0) {
            setError(
                `Invalid filenames detected:\n${invalidFiles.join("\n")}`
            );
            setFile(null);
        } else {
            setError("");
            setFile(zipFile);
        }
    };

    const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        await imagePostBulkUploadReferences(formData, organization?.id);
        
        addNotification({
            text: "Successfully uploaded reference images!",
            type: "success"
        });

        await frogsPostRequest(organization?.id);

        addNotification({
            text: "Successfully instantiated frogs in the database!",
            type: "success"
        });
    } catch (error) {
        addNotification({
            text: error.message || "Something went wrong",
            type: "error"
        });
    }
};

    return (
        <>
            <p className='info-message'>
                Make sure that <b>ALL</b> images are named:
                frog&lt;number&gt;_tank&lt;number&gt;
                (e.g. frog4_tank3.png)
            </p>

            <div className='setting-buttons'>
                <input
                    className="zip-input"
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                />

                <button
                    className='setting-button save'
                    onClick={handleUpload}
                    disabled={!file}
                >
                    Upload
                </button>
            </div>

            {error && <pre className="error-message">{error}</pre>}
        </>
    );
}