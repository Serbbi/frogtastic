import './HelpPage.css';

export default function HelpContent() {
    return (
        <div className="helpContent">
            <h1 className='title'>Help</h1>
            
            <div className="helpSection">
                <h2>Handling Image Error</h2>
                <p>This error occurs when the algorithm fails to successfully extract the frog pattern from the image. Several factors can contribute to this issue, such as the image being too blurry, too small, too large, or the frog pattern not being sufficiently visible. 
                    To minimize the risk of this error, ensure that the image is clear, the frog pattern is visible, and the image resolution is ideally around 3000x4000 pixels. It's recommended to place the frog on the designated box, use a tripod to take the photo and remove any darker colored objects from the frame.
                     Additionally, capture the image in a well-lit environment, avoiding any shadows on the frog. If the error continues, try changing the angle or using a different camera.</p>
                <p>Examples of good and bad images will be added soon.</p>
            </div>

            <div className="helpSection">
                <h2>Network Error</h2>
                <p>A network error can occur if the server is temporarily unavailable or if your authentication token has expired. To resolve this, try logging in again. If the problem persists, wait a few minutes and attempt to connect later.</p>
            </div>

            <div className="helpSection">
                <h2>Unauthorized Error</h2>
                <p>This error arises when you attempt to modify details related to the organization or frogs without the necessary permissions. Ensure you have the appropriate access rights before making any changes.</p>
            </div>
        </div>
    );
}