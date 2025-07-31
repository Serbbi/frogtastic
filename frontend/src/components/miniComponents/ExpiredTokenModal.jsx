import { Link } from "react-router-dom";
import './ExpiredTokenModal.css';

export default function ExpiredTokenModal() {
    function handleLogOut() {
        localStorage.clear();
        sessionStorage.clear();
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="modalText">
                    <h1 className="modalTitle">Your token has expired</h1>
                    <p className="modalMessage">Please log in again to continue using the app</p>
                    <Link to='/' className="modalLink" onClick={handleLogOut}>Log in</Link>
                </div>
            </div>
        </div>
    );
}