import PropTypes from 'prop-types';

export default function AdminLeftNavBar({ setContent }) {
    function goBackToHomePage() {
        window.location.href = "/home";
    }

    function changeContent(name) {
        return function () {
            const newContent = {
                allUsersContent: false,
                createUserContent: false
            };
            newContent[name] = true;
            setContent(newContent);
        }
    }

    return (
        <div className="leftNav">
            <ul className="menu">
                <button className="menuOption" onClick={changeContent("allUsersContent")}>All users</button>
                <button className="menuOption" onClick={changeContent("createUserContent")}>Create user</button>
            </ul>
            <button className="menuOption logOut" onClick={goBackToHomePage}>Home Page</button>
        </div>
    );
}

AdminLeftNavBar.propTypes = {
    setContent: PropTypes.func.isRequired,
};