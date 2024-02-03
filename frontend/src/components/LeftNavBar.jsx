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
                createFrog: false
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
                <li className="menuOption" onClick={changeContent("allFrogs")}>All Frogs</li>
                <li className="menuOption" onClick={changeContent("tankFrogs")}>Tank Frogs</li>
                <li className="menuOption" onClick={changeContent("uploadImage")}>Upload Image</li>
                <li className="menuOption" onClick={changeContent("createFrog")}>Create Frog</li>
                {admin ? <li className="menuOption" onClick={goToAdminPage}>Admin Page</li> : null}
            </ul>

            <p className="menuOption logOut" onClick={logOut}>Log Out</p>
        </div>
    );
}