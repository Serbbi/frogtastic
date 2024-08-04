import FrogDetailsContent from "../miniComponents/frogDetailsContent";
import { useState, useRef, useEffect } from "react";
import Loading from "../miniComponents/loading";
import "./uploadContent.css";
import Camera from "../miniComponents/Camera";
import { throwIfNotOk } from "../../util/errorThrower";
import ErrorContent from "../miniComponents/ErrorContent";
import { useOrganization } from "../../hooks/OrganizationProvider";

export default function UploadContent() {
    const [success, setSuccess] = useState("default");
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isActiveCamera, setIsActiveCamera] = useState(false);
    const [blob, setBlob] = useState(null);
    const [frog, setFrog] = useState({});
    const [errorMessage, setErrorMessage] = useState("There was an error uploading the image.");
    const dropContainer = useRef(null);
    const { organization } = useOrganization();

    async function postRequest(formData) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/${organization.id}`, {
            method: 'POST',
            body: formData
        });
        
        throwIfNotOk(response);

        return await response.json();
    }

    function uploadImage() {
        const formData = new FormData();
        if(blob) {
            formData.append('file', blob);
        } else {
            formData.append('file', document.querySelector('input[type="file"]').files[0]);
        }
        setIsLoading(true);

        postRequest(formData)
            .then(data => {
                if(data.error) {
                    setSuccess("error");
                    setErrorMessage(data.error);
                    return;
                }
                setSuccess("success");
                setFrog(data);
                document.querySelector(".uploadContainer").style.display = "block";
            })
            .catch(error => {
                setSuccess("error");
                setErrorMessage(error.message);
            })
            .finally(() => setIsLoading(false));
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
        setIsActiveCamera(false);
        setFileName("");
        document.querySelector(".uploadContainer").style.display = "flex";
    }

    if(isLoading) return (<div className="uploadContainer"><Loading /></div>);

    if(isActiveCamera) return (<div className="uploadContainer"><Camera goBackToDefault={goBackToDefault} 
                                                                        setBlob={setBlob} 
                                                                        setFileName={setFileName} /></div>);

    return (
        <div className="uploadContainer">
            {success === "success" ? <FrogDetailsContent frog={frog} goBackAction={goBackToDefault}/> : null}
            {success === "error" ? <ErrorContent errorMessage={errorMessage} goBack={goBackToDefault}/> : null}
            {success === "default" ?
                <div className="uploadDefaultElements">
                    <label ref={dropContainer} className="drop-container" id="dropcontainer">
                        <span className="drop-title">Drop files here</span>
                        <p className="orWord">or</p>
                        <input type="file" name="image" id="image" required className="inputField" onChange={saveImageName}/>
                        <span className="browseFilesButton">Browse files</span>
                        <span className="file-name">{fileName}</span>
                    </label>
                    <button onClick={uploadImage} className="uploadButton">Upload</button>
                    {/* <button onClick={() => setIsActiveCamera(true)} className="uploadButton">Take photo</button> */}
                </div>
                : null}
        </div>
    );
}