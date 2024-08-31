import './ConfirmationBox.css';

export default function ConfirmationBox({ message, onConfirm, onCancel }) {
    return (
        <div className="confirmation-box">
            <div className="confirmation-box-content">
                <div className="confirmation-box__message">{message}</div>
                <div className="confirmation-box__buttons">
                    <button className="confirmation-box__button confirmation-box__button--confirm" onClick={onConfirm}>Confirm</button>
                    <button className="confirmation-box__button confirmation-box__button--cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}