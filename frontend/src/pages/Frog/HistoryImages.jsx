import './HistoryImages.css';

export default function HistoryImages({ imageLocations }) {

    function formatCaption(imagePath) {
        const fileName = imagePath.split("/")[3];
        const dateTime = fileName.split(".")[0].split("_").slice(1).join(" ");
        const rearrangedDate = dateTime.split(" ")[0].split("-").reverse().join("/");
        const rearrangedTime = dateTime.split(" ")[1].replace(/-/g, ":");
        return `${rearrangedDate} ${rearrangedTime}`;
    }

    return (
        <div className="frogDetailsContainer">
            <div className="imagesGridHeader">
                <p className="imagesGridHeaderText">Images</p>
            </div>
            <div className="imagesGrid">
                {imageLocations.map((image, index) => (
                    <div className="imageContainer" key={index}>
                        <img src={`https://storage.googleapis.com/${image}`} className="histFrogImg" alt={`Frog image ${index + 1}`} />
                        <p className="imageContainerText">{formatCaption(image)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}