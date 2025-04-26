import { NavLink } from 'react-router-dom';

export default function ChangeLogPage() {
    return (
        <div className="changeLogContent">
            <h1 className='title'>Change Log</h1>
            <div className='importantNews'>
                <h3>Important News</h3>
                <p>Here they may appear some known issues and how to fix them.</p>
                <ul>
                    <li>Sometimes, after logging in when redirected from the expired token modal, the organization name will disappear and the user will experience dubious errors, you can fix this by just refreshing the page after logging in again.</li>
                </ul>
            </div>
            <div className='changeLog'>
                <h3>Version 0.7.0</h3>
                <ul>
                    <li>Added Change Log page</li>
                    <li>Remade the whole system parameters page</li>
                    <li>Added a modal which appears when the token of the current session expires</li>
                    <li>Fixed some bugs</li>
                </ul>
            </div>
            <NavLink to="/" className="backButton">Back to Login</NavLink>
        </div>
    );
}