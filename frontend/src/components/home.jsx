import { useState } from "react"
import UploadContent from "./uploadPage/uploadContent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./home.css";
import LeftNavBar from "./LeftNavBar";
import AllFrogsContent from "./allFrogsPage/AllFrogsContent";
import TankFrogsContent from "./tankFrogsPage/TankFrogsContent";

export default function Home() {
    const [content, setContent] = useState({
        allFrogs: false,
        tankFrogs: false,
        uploadImage: true
    });
    const [navPanelVisibility, setNavPanelVisibility] = useState(true);
    const [angleButton, setAngleButton] = useState("fa-solid fa-angle-left");

    function hideNavPanel() {
        if (navPanelVisibility) {
            setAngleButton("fa-solid fa-angle-right");
        } else {
            setAngleButton("fa-solid fa-angle-left");
        }
        setNavPanelVisibility(!navPanelVisibility);
    }

    return <div className="homeContainer">
        {navPanelVisibility ? <LeftNavBar setContent={setContent} /> : null}
        <div className="mainContent">
            <FontAwesomeIcon icon={angleButton} className="hideNavButton" onClick={hideNavPanel} />
            {content.allFrogs ? <AllFrogsContent /> : null}
            {content.tankFrogs ? <TankFrogsContent /> : null}
            {content.uploadImage ? <UploadContent /> : null}
        </div>
    </div>
}
