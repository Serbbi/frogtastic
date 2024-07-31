import { useState, useEffect } from "react"
import UploadContent from "./uploadPage/uploadContent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LeftNavBar from "./LeftNavBar";
import AllFrogsContent from "./allFrogsPage/AllFrogsContent";
import TankFrogsContent from "./tankFrogsPage/TankFrogsContent";
import "./home.css";
import AppHeader from "./AppHeader/AppHeader";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import CreateOrganizationMenu from "./organizationComponents/CreateOrganizationMenu";
import JoinOrganizationMenu from "./organizationComponents/JoinOrganizationMenu";
import SettingsMenu from "./Settings/SettingsMenu";
import { useOrganization } from "../hooks/OrganizationProvider";

export default function Home() {
    const { organization } = useOrganization();
    const [content, setContent] = useState({
        allFrogs: false,
        tankFrogs: false,
        uploadImage: true,
        createOrganization: false,
        joinOrganization: false,
        organizationSettings: false
    });

    const [navPanelVisibility, setNavPanelVisibility] = useState(true);
    const [angleButton, setAngleButton] = useState("fa-solid fa-angle-left");

    useEffect(() => {
        if (organization) {
            setContent({
                allFrogs: false,
                tankFrogs: false,
                uploadImage: true,
                createOrganization: false,
                joinOrganization: false,
                organizationSettings: false
            });
        } else {
            setContent({
                allFrogs: false,
                tankFrogs: false,
                uploadImage: false,
                createOrganization: false,
                joinOrganization: true,
                organizationSettings: false
            });
        }
    }, [organization]);

    function hideNavPanel() {
        if (navPanelVisibility) {
            setAngleButton("fa-solid fa-angle-right");
        } else {
            setAngleButton("fa-solid fa-angle-left");
        }
        setNavPanelVisibility(!navPanelVisibility);
    }


    return <div className="homeContainer">
        <AppHeader />
        <div className="sidebarAndMainContent">
            <LeftSideBar setContent={setContent} />
            {content.allFrogs ? <AllFrogsContent /> : null}
            {content.tankFrogs ? <TankFrogsContent /> : null}
            {content.uploadImage ? <UploadContent /> : null}
            {content.createOrganization ? <CreateOrganizationMenu /> : null}
            {content.joinOrganization ? <JoinOrganizationMenu /> : null}
            {content.organizationSettings ? <SettingsMenu /> : null}
        </div>
        {/* {navPanelVisibility ? <LeftNavBar setContent={setContent} /> : null} */}
        {/* <div className="mainContent">
            <FontAwesomeIcon icon={angleButton} className="hideNavButton" onClick={hideNavPanel} />
            {content.allFrogs ? <AllFrogsContent /> : null}
            {content.tankFrogs ? <TankFrogsContent /> : null}
            {content.uploadImage ? <UploadContent /> : null}
            {content.createFrog ? <CreateFrogContent /> : null}
        </div> */}
    </div>
}
