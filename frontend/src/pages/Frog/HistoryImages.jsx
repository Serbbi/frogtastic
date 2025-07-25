import { useState } from 'react';
import SimpleCompareModal from './SimpleCompareModal';
import './HistoryImages.css';

export default function HistoryImages({ imageLocations }) {
    const [selectedImages, setSelectedImages] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    function formatCaption(imagePath) {
        const fileName = imagePath.split("/")[3];
        const dateTime = fileName.split(".")[0].split("_").slice(1).join(" ");
        const rearrangedDate = dateTime.split(" ")[0].split("-").reverse().join("/");
        const rearrangedTime = dateTime.split(" ")[1].replace(/-/g, ":");
        return `${rearrangedDate} ${rearrangedTime}`;
    }

    function handleSelectImage(image) {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter(img => img !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    }

    return (
        <div className="frogDetailsContainer">
            <div className="imagesGridHeader">
                <p className="imagesGridHeaderText">Images</p>
            </div>
            <div className="imagesGrid">
                {imageLocations.map((image, index) => (
                    <div className="imageContainer" key={index}>
                        <input type="checkbox" className="imageCheckbox" onChange={() => handleSelectImage(image)} />
                        <img src={`https://storage.googleapis.com/${image}`} className="histFrogImg" alt={`Frog image ${index + 1}`} />
                        <p className="imageContainerText">{formatCaption(image)}</p>
                    </div>
                ))}
            </div>
            <button className="primary-button" onClick={() => setShowCompareModal(true)} disabled={selectedImages.length !== 2}>Compare</button>
            {showCompareModal &&
                <SimpleCompareModal
                    setShowCompareModal={setShowCompareModal}
                    image1={`https://storage.googleapis.com/${selectedImages[0]}`}
                    image2={`https://storage.googleapis.com/${selectedImages[1]}`}
                    text1={formatCaption(selectedImages[0])}
                    text2={formatCaption(selectedImages[1])}
                />
            }
        </div>
    );
}