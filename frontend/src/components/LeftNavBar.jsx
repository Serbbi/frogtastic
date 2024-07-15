import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import "./LeftNavBar.css";

export default function LeftNavBar({ setContent }) {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('privileges'))['canEditUsers'];

    function changeContent(name) {
        return function () {
            const newContent = {
                allFrogs: false,
                tankFrogs: false,
                uploadImage: false,
                createFrog: false,
                createOrganization: false,
                joinOrganization: false
            };
            newContent[name] = true;
            setContent(newContent);
        }
    }

    function goToAdminPage() {
        navigate("/admin");
    }

    function logOut() {
        localStorage.removeItem('site');
        localStorage.removeItem('privileges');
        navigate("/");
    }

    return (
        <div className="leftNav">
            <ul className="menu">
                <button className="menuOption" onClick={changeContent("allFrogs")}>All Frogs</button>
                <button className="menuOption" onClick={changeContent("tankFrogs")}>Tank Frogs</button>
                <button className="menuOption" onClick={changeContent("uploadImage")}>Upload Image</button>
                <button className="menuOption" onClick={changeContent("createFrog")}>Create Frog</button>
                {admin ? <button className="menuOption" onClick={goToAdminPage}>Admin Page</button> : null}
            </ul>

            <button className="menuOption logOut" onClick={logOut}>Log Out</button>
        </div>
    );
}

LeftNavBar.propTypes = {
    setContent: PropTypes.func.isRequired,
};