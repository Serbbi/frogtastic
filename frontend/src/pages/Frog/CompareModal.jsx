import { useNavigate } from "react-router-dom";
import { imagePutRequest } from "../../services/api/image/ImagePut";
import { useNotification } from "../../services/providers/NotificationProvider";

export default function CompareModal({ frog, setShowCompareModal, extractionImageURL, showButtons, setShowModalButtonsOnce, access }) {
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    async function handleSaveImage(decision) {
        setShowCompareModal(false);
        setShowModalButtonsOnce(false);
        imagePutRequest(decision, frog.id, frog.organization_id)
            .then(() => {
                if (decision === "yes") {
                    addNotification({ text: "Image saved successfully", type: "success" });
                } else {
                    addNotification({ text: "Image accepted without saving", type: "success" });
                }
            })
            .catch(error => {
                addNotification({ text: error.message, type: "error" });
            });
    }

    return (
        <div className="modalCompareImages">
            <div className="modalCompareImagesContent">
                <span className='closeJoinOrg' onClick={() => setShowCompareModal(false)}>&times;</span>
                <div>
                    <h2>Extraction Image</h2>
                    <img src={`data:image/png;base64,${extractionImageURL}`} alt="Extraction" />
                </div>
                <div>
                    <h2>Reference Image</h2>
                    <img src={frog.reference_image_url} alt="Reference" />
                </div>
                {showButtons &&
                    <div className="compare-modal-buttons">
                        <button onClick={() => handleSaveImage("yes")} className="primary-button compare-modal" disabled={!access}>Accept and save</button>
                        <button onClick={() => handleSaveImage("no")} className="secondary-button compare-modal">Accept without saving</button>
                        <button onClick={() => navigate(-1)} className="secondary-button compare-modal">Reject</button>
                    </div>
                }
            </div>
        </div>
    )
}