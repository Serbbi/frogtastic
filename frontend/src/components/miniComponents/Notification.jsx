import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Notification.css';

export default function Notification({ message, type, deleteNotification }) {
  return (
    <div className={`notification ${type}`} onAnimationEnd={deleteNotification}>
      {type === 'success' && <FontAwesomeIcon icon="fa-solid fa-check" />}
      {type === 'trash' && <FontAwesomeIcon icon="fa-solid fa-trash-can" />}
      {type === 'error' && <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />}
      <p>{message}</p>
      {/* <button onClick={deleteNotification}>X</button> */}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  deleteNotification: PropTypes.func.isRequired
};

