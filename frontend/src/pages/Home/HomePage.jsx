import UploadPage from "../Upload/UploadPage";
import AllFrogsPage from "../AllFrogs/AllFrogsPage";
import TankFrogsPage from "../TankFrogs/TankFrogsPage";
import AppHeader from "../../components/AppHeader/AppHeader";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import JoinOrganizationPage from "../Organization/JoinOrganizationPage";
import SettingsPage from "../Settings/SettingsPage";
import { Route, Routes } from "react-router-dom";
import ImageProvider from "../../services/providers/ImageProvider";
import SystemParametersPage from "../SystemParameters/SystemParametersPage";
import HelpPage from "../Help/HelpPage";
import FrogPage from "../Frog/FrogPage";
import ProfileSettingsPage from "../ProfileSettings/ProfileSettingsPage";
import { UnsavedChangesProvider } from "../../services/providers/UnsavedChangesProvider";
import AdminSettingsPage from "../AdminSettings/AdminSettingsPage";
import './HomePage.css';

export default function HomePage() {
    return (
        <div className="homeContainer">
            <div className="sidebarAndRightSide">
                <UnsavedChangesProvider>
                    <LeftSideBar />
                    <div className="headerAndMainContent">
                        <ImageProvider>
                            <AppHeader />
                            <Routes>
                                <Route path="/all-frogs" element={<AllFrogsPage />} />
                                <Route path="/tank-frogs" element={<TankFrogsPage />} />
                                <Route path="/upload-image" element={<UploadPage />} />
                                <Route path="/system-parameters" element={<SystemParametersPage />} />
                                <Route path="/join-organization" element={<JoinOrganizationPage />} />
                                <Route path="/organization-settings" element={<SettingsPage />} />
                                <Route path="/frog/:frogId" element={<FrogPage />} />
                                <Route path="/help" element={<HelpPage />} />
                                <Route path="/help/:category" element={<HelpPage />} />
                                <Route path="/profile-settings/:userName" element={<ProfileSettingsPage />} />
                                <Route path="/admin-settings" element={<AdminSettingsPage />} />
                            </Routes>
                        </ImageProvider>
                    </div>
                </UnsavedChangesProvider>
            </div>
        </div>
    );
}
