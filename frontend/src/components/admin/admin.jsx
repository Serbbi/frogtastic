import AdminLeftNavBar from "./AdminLeftNavBar";
import AllUsersContent from "./AllUsersContent";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Admin() {
    const [navPanelVisibility, setNavPanelVisibility] = useState(true);
    const [angleButton, setAngleButton] = useState("fa-solid fa-angle-left");
    const [content, setContent] = useState({
        allUsersContent: true,
        createUserContent: false
    });

    function hideNavPanel() {
        if (navPanelVisibility) {
            setAngleButton("fa-solid fa-angle-right");
        } else {
            setAngleButton("fa-solid fa-angle-left");
        }
        setNavPanelVisibility(!navPanelVisibility);
    }

    return (
        <div className="homeContainer">
            {navPanelVisibility ? <AdminLeftNavBar setContent={setContent} /> : null}
            <div className="mainContent">
                <FontAwesomeIcon icon={angleButton} className="hideNavButton" onClick={hideNavPanel} />
                {content.allUsersContent ? <AllUsersContent /> : null}
                {content.createUserContent ? <div>Create user content</div> : null}
            </div>
        </div>
    );
}