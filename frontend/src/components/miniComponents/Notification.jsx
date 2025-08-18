import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Notification.css';

export default function Notification({ message, type, deleteNotification }) {
    return (
        <div className={`notification ${type}`} onAnimationEnd={deleteNotification}>
            {type === 'success' && <FontAwesomeIcon icon="fa-solid fa-check" />}
            {type === 'warning' && <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />}
            {type === 'trash' && <FontAwesomeIcon icon="fa-solid fa-trash-can" />}
            {type === 'error' && <FontAwesomeIcon icon="fa-solid fa-xmark" />}
            {type === 'information' && <FontAwesomeIcon icon="fa-solid fa-info" />}
            <p>{message}</p>
        </div>
    );
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    deleteNotification: PropTypes.func.isRequired
};

