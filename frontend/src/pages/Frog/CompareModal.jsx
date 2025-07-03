import { useNavigate } from "react-router-dom";

export default function CompareModal({ frog, setShowCompareModal, extractionImageURL }) {
    const navigate = useNavigate();
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
                    <img src={frog.image_path} alt="Reference" />
                </div>
                {/* <div className="compare-modal-buttons">
                    <button onClick={() => setShowCompareModal(false)} className="primary-button">Accept</button>
                    <button onClick={() => navigate(-1)} className="primary-button">Reject</button>
                </div> */}
            </div>
        </div>
    )
}