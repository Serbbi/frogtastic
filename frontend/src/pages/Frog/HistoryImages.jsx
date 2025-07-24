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
                {/* <div className="imageContainer">
                    <img src="https://storage.googleapis.com/cool_frog_bucket/uploads/232/232_2025-07-23_10-07" className="histFrogImg" />
                    <p className="imageContainerText">23/07/2025 10:07</p>
                {/* <div className="imageContainer">
                    <img src="https://storage.googleapis.com/cool_frog_bucket/uploads/232/232_2025-07-23_10-07" className="histFrogImg" />
                    <p className="imageContainerText">23/07/2025 10:07</p>
                </div>
                <div className="imageContainer">
                    <img src="https://storage.googleapis.com/cool_frog_bucket/uploads/232/232_2025-07-23_10-07" className="histFrogImg" />
                    <p className="imageContainerText">23/07/2025 10:07</p>
                </div>
                <div className="imageContainer">
                    <img src="https://storage.googleapis.com/cool_frog_bucket/uploads/232/232_2025-07-23_10-07" className="histFrogImg" />
                    <p className="imageContainerText">23/07/2025 10:07</p>
                </div>
                <div className="imageContainer">
                    <img src="https://storage.googleapis.com/cool_frog_bucket/uploads/232/232_2025-07-23_10-07" className="histFrogImg" />
                    <p className="imageContainerText">23/07/2025 10:07</p>
                </div> */}
            </div>
        </div>
    );
}