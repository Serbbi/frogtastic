import { useOrganization } from '../../hooks/OrganizationProvider';
import { useNavigate } from "react-router-dom";
import './LeftSideBar.css';

export default function LeftSideBar({ setContent }) {
    const { organization, setOrganization } = useOrganization();
    const navigate = useNavigate();

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

    function logOut() {
        localStorage.clear();
        setOrganization(-1);
        navigate("/");
    }

    return (
        <div className="leftBar">
            {organization ? 
            <ul className='menuList'>
                <li onClick={changeContent("allFrogs")}>All Frogs</li>
                <li onClick={changeContent("tankFrogs")}>Tank Frogs</li>
                <li onClick={changeContent("uploadImage")}>Upload Image</li>
                {/* <li onClick={changeContent("createFrog")}>Create Frog</li> */}
                <li>System Parameters</li>
            </ul> 
            : null}
            
            <hr></hr>
            <ul className='menuList'>
                <li onClick={changeContent("joinOrganization")}>Join Organization</li>
                <li onClick={changeContent("createOrganization")}>Create Organization</li>
                {organization ? <li onClick={changeContent("organizationSettings")}>Organization Settings</li> : null}
            </ul>
            <button className='logoutButton' onClick={() => logOut()}>Log Out</button>
        </div>
    );
}