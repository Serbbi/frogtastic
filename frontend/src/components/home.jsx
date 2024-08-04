import UploadContent from "./uploadPage/uploadContent";
import AllFrogsContent from "./allFrogsPage/AllFrogsContent";
import TankFrogsContent from "./tankFrogsPage/TankFrogsContent";
import AppHeader from "./AppHeader/AppHeader";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import CreateOrganizationMenu from "./organizationComponents/CreateOrganizationMenu";
import JoinOrganizationMenu from "./organizationComponents/JoinOrganizationMenu";
import SettingsMenu from "./Settings/SettingsMenu";
import { Route, Routes } from "react-router-dom";
import "./home.css";

export default function Home() {
    return <div className="homeContainer">
        <AppHeader />
        <div className="sidebarAndMainContent">
            <LeftSideBar />
            <Routes>
                <Route path="/all-frogs" element={<AllFrogsContent/> } />
                <Route path="/tank-frogs" element={<TankFrogsContent/> } />
                <Route path="/upload-image" element={<UploadContent/> } />
                <Route path="/create-organization" element={<CreateOrganizationMenu/> } />
                <Route path="/join-organization" element={<JoinOrganizationMenu/> } />
                <Route path="/organization-settings" element={<SettingsMenu/> } />
            </Routes>
        </div>
    </div>
}
