import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideBarItem({ icon, label, path, onClick }) {
    const isActive = (path) => window.location.pathname === path;

    return (
        <li onClick={onClick} className={`navLink${isActive(path) ? " active" : ""}`}>
            <FontAwesomeIcon icon={icon} className='menuIcon' />
            <span>{label}</span>
        </li>
    );
}
