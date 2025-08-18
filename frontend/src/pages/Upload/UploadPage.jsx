import { useState, useRef, useEffect } from "react";
import Loading from "../../components/miniComponents/loading";
import ErrorContent from "../../components/miniComponents/ErrorContent";
import { useNavigate } from "react-router-dom";
import { useImage } from "../../services/providers/ImageProvider";
import { imagePostRequest } from "../../services/api/image/ImagePost";
import './UploadPage.css';

export default function UploadPage({ organization }) {
    const [success, setSuccess] = useState("default");
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("There was an error uploading the image.");
    const [modelUsed, setModelUsed] = useState(sessionStorage.getItem("lastSelectedModel") ? parseInt(sessionStorage.getItem("lastSelectedModel")) : 1);
    const dropContainer = useRef(null);
    const navigate = useNavigate();
    const { setExtractionImageURL } = useImage();

    function uploadImage() {
        const formData = new FormData();
        const file = document.querySelector('input[type="file"]').files[0];
        if (!verifyFile(file)) return;

        formData.append('file', file);
        setIsLoading(true);

        imagePostRequest(formData, organization.id, modelUsed)
            .then(data => {
                setExtractionImageURL(data.image);
                if (data.error) {
                    setSuccess("error");
                    setErrorMessage(data.error);
                    return;
                }

                setSuccess("success");
                navigate(`/home/frog/${data.frog.id}`, { state: "from upload" });
                document.querySelector(".uploadContainer").style.display = "block";
            })
            .catch(error => {
                setSuccess("error");
                setErrorMessage(error.message);
            })
            .finally(() => setIsLoading(false));
    }

    function verifyFile(file) {
        if (!file) {
            setSuccess("error");
            setErrorMessage("Please select a file to upload.");
            return false;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            setSuccess("error");
            setErrorMessage("Invalid image format. Please upload a .jpeg, .jpg, or .png file.");
            return false;
        }

        return true;
    }

    useEffect(() => {
        const onDragOver = (e) => {
            e.preventDefault();
        };

        const onDragEnter = () => {
            dropContainer.current.classList.add("drag-active");
        };

        const onDragLeave = () => {
            dropContainer.current.classList.remove("drag-active");
        };

        const onDrop = (e) => {
            e.preventDefault();
            dropContainer.current.classList.remove("drag-active");
            document.getElementById("image").files = e.dataTransfer.files;
            setFileName(e.dataTransfer.files[0].name);
        };

        const dropElem = dropContainer.current;
        dropElem.addEventListener("dragover", onDragOver);
        dropElem.addEventListener("dragenter", onDragEnter);
        dropElem.addEventListener("dragleave", onDragLeave);
        dropElem.addEventListener("drop", onDrop);

        return () => {
            dropElem.removeEventListener("dragover", onDragOver);
            dropElem.removeEventListener("dragenter", onDragEnter);
            dropElem.removeEventListener("dragleave", onDragLeave);
            dropElem.removeEventListener("drop", onDrop);
        };
    }, []);

    function saveImageName(e) {
        const image = e.target.files[0].name;
        setFileName(image);
    }

    function goBackToDefault() {
        setSuccess("default");
        setFileName("");
        document.querySelector(".uploadContainer").style.display = "flex";
    }

    function updateModelUsed(event) {
        sessionStorage.setItem("lastSelectedModel", event.target.value);
        setModelUsed(event.target.value);
    }

    if (isLoading) return (<div className="uploadContainer"><Loading /></div>);

    return (
        <div className="uploadContainer">
            {success === "error" ? <ErrorContent errorMessage={errorMessage} goBack={goBackToDefault} /> : null}
            {success === "default" ?
                <div className="uploadDefaultElements">
                    <select onChange={updateModelUsed} value={modelUsed}>
                        <option value={0}>Old</option>
                        <option value={1}>Clean</option>
                        <option value={2}>New</option>
                        <option value={3}>OneShot</option>
                    </select>
                    <label ref={dropContainer} className="drop-container" id="dropcontainer">
                        <span className="drop-title">Drop files here</span>
                        <p className="orWord">or</p>
                        <input type="file" name="image" id="image" required className="inputField" onChange={saveImageName} accept=".jpeg, .jpg, .png" />
                        <span className="browseFilesButton">Browse files</span>
                        <span className="file-name">{fileName}</span>
                    </label>
                    <button onClick={uploadImage} className="primary-button upload-button">Upload</button>
                </div>
                : null}
        </div>
    );
}