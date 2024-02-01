import { useState } from "react"
import UploadContent from "./uploadContent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./home.css";
import LeftNavBar from "./LeftNavBar";
import AllFrogsContent from "./AllFrogsContent";

export default function Home() {
    const [content, setContent] = useState({
        allFrogs: false,
        tankFrogs: false,
        uploadImage: true
    });
    const [navPanelVisibility, setNavPanelVisibility] = useState(true);
    const [angleButton, setAngleButton] = useState("fa-solid fa-angle-left");

    function hideNavPanel() {
        if(navPanelVisibility) {
            setAngleButton("fa-solid fa-angle-right");
        } else {
            setAngleButton("fa-solid fa-angle-left");
        }
        setNavPanelVisibility(!navPanelVisibility);
    }

    return <div className="homeContainer">
        {navPanelVisibility ? <LeftNavBar setContent={setContent} /> : null}
        <div className="mainContent">
            <FontAwesomeIcon icon={angleButton} className="hideNavButton" onClick={hideNavPanel}/>
            {content.allFrogs ? <AllFrogsContent /> : null}
            {content.tankFrogs ? <div>Tank frogs</div> : null}
            {content.uploadImage ? <UploadContent /> : null}
        </div>
    </div>
}
