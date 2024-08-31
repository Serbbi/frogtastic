import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ErrorContent({ errorMessage, goBack }) {
    return (
        <div className="errorContent">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={goBack} className="goBackButton" />
            <h3>{errorMessage}</h3>
            <p>For more information about the errors, please check our <a href='/home/help'>help</a> page.</p>
        </div>
    );
}

ErrorContent.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    goBack: PropTypes.func.isRequired
};