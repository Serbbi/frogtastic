import { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import {
    MediaPermissionsErrorType,
    requestMediaPermissions
} from "mic-check";

const videoConstraints = {
    width: 540,
    facingMode: "environment"
};

export default function Camera({ goBackToDefault, setBlob, setFileName }) {
    const webcamRef = useRef(null);

    const capturePhoto = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        setBlob(blob);
        goBackToDefault();
        setFileName("photo.jpg");
    }, [webcamRef]);

    const onUserMedia = (e) => {
        console.log(e);
    };

    useEffect(() => {
        requestMediaPermissions({ audio: false, video: true })
            .then(() => {
                console.log("okkeee");
            })
            .catch((err) => {
                const { type } = err;
                if (
                    type === MediaPermissionsErrorType.SystemPermissionDenied ||
                    type === MediaPermissionsErrorType.UserPermissionDenied ||
                    type === MediaPermissionsErrorType.CouldNotStartVideoSource
                ) {
                    alert("error");
                }
            });
    }, []);

    return (
        <>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
            />
            <button onClick={capturePhoto} className="uploadButton" >Capture</button>
        </>
    );
};

Camera.propTypes = {
    goBackToDefault: PropTypes.func.isRequired,
    setBlob: PropTypes.func.isRequired,
    setFileName: PropTypes.func.isRequired
};