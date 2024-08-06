import UploadContent from "./uploadPage/uploadContent";
import AllFrogsContent from "./allFrogsPage/AllFrogsContent";
import TankFrogsContent from "./tankFrogsPage/TankFrogsContent";
import AppHeader from "./AppHeader/AppHeader";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import CreateOrganizationMenu from "./organizationComponents/CreateOrganizationMenu";
import JoinOrganizationMenu from "./organizationComponents/JoinOrganizationMenu";
import SettingsMenu from "./Settings/SettingsMenu";
import { Route, Routes } from "react-router-dom";
import FrogDetailsConten from "./miniComponents/frogDetailsContent";
import { useOrganization } from "../hooks/OrganizationProvider";
import "./home.css";

export default function Home() {
    const { organization, setOrganization } = useOrganization();

    return (
        <div className="homeContainer">
            <div className="sidebarAndRightSide">
                <LeftSideBar organization={organization} setOrganization={setOrganization} />
                <div className="headerAndMainContent">
                    <AppHeader organization={organization} setOrganization={setOrganization}/>
                    <Routes>
                        <Route path="/all-frogs" element={<AllFrogsContent/> } />
                        <Route path="/tank-frogs" element={<TankFrogsContent/> } />
                        <Route path="/upload-image" element={<UploadContent/> } />
                        <Route path="/create-organization" element={<CreateOrganizationMenu/> } />
                        <Route path="/join-organization" element={<JoinOrganizationMenu/> } />
                        <Route path="/organization-settings" element={<SettingsMenu/> } />
                        <Route path="/frog/:frogId" element={<FrogDetailsConten /> } />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
