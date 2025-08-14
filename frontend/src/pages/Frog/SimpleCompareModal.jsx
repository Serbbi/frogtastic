export default function CompareModal({ setShowCompareModal, image1, image2, text1, text2 }) {
    return (
        <div className="modalCompareImages">
            <div className="modalCompareImagesContent">
                <span className='closeJoinOrg' onClick={() => setShowCompareModal(false)}>&times;</span>
                <div>
                    <h2>{text1}</h2>
                    <img src={image1} alt="Left Pattern" />
                </div>
                <div>
                    <h2>{text2}</h2>
                    <img src={image2} alt="Right Pattern" />
                </div>
            </div>
        </div>
    )
}