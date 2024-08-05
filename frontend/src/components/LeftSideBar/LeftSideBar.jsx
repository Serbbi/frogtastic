import { useOrganization } from '../../hooks/OrganizationProvider';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import './LeftSideBar.css';

export default function LeftSideBar() {
    const { organization, setOrganization } = useOrganization();
    const userId = localStorage.getItem("userId");
    const canCreateOrganization = JSON.parse(localStorage.getItem('privileges'))['privileges']['canCreateOrganization'];
    const navigate = useNavigate();

    function logOut() {
        localStorage.clear();
        setOrganization(-1);
        navigate("/");
    }

    return (
        <div className="leftBar">
            {organization ? 
            <ul className='menuList'>
                <li>
                    <NavLink to="/home/all-frogs" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>All Frogs</NavLink>
                </li>
                <li>
                    <NavLink to="/home/tank-frogs" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>Tank Frogs</NavLink>
                </li>
                <li>
                    <NavLink to="/home/upload-image" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>Upload Image</NavLink>
                </li>                    
                <li>System Parameters</li>
            </ul> 
            : null}
            
            <hr></hr>
            <ul className='menuList'>
                <li>
                    <NavLink to="/home/join-organization" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>Join Organization</NavLink>
                </li>
                {canCreateOrganization ?
                    <li>
                        <NavLink to="/home/create-organization" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>Create Organization</NavLink>
                    </li>
                : null}
                {organization && organization.admins.includes(Number(userId)) ?
                    <li>
                        <NavLink to="/home/organization-settings" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>Organization Settings</NavLink>
                    </li>
                : null}
            </ul>
            <button className='logoutButton' onClick={() => logOut()}>Log Out</button>
        </div>
    );
}