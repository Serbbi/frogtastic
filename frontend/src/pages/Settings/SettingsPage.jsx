import useFrogs from '../../hooks/useFrogs';
import { useOrganization } from '../../services/providers/OrganizationProvider';
import FrogAttributesSetting from './FrogAttributesSetting';
import TableColumnsSetting from './TableColumnsSetting'
import TanksSetting from './TanksSetting';
import UserPrivilegesSetting from './UserPrivilegesSetting';
import './SettingsPage.css';
import SystemParametersSetting from './SystemParametersSetting';
import LogoSetting from './LogoSetting';
import SettingSection from './SettingSection';
import FrogReferencesSetting from './FrogReferencesSetting';

export default function SettingsPage() {
    const { organization } = useOrganization();
    const { frogs } = useFrogs(null, organization ? organization.id : -1, null, 1);

    return (
        <div className="settings-content">
            <h1 className='title'>Settings</h1>
            <SettingSection title="Frog Attributes">
                <FrogAttributesSetting frog={frogs ? frogs[0] : null} organization={organization} />
            </SettingSection>
            <SettingSection title="Frog Table Columns">
                <TableColumnsSetting frog={frogs ? frogs[0] : null} organization={organization} />
            </SettingSection>
            <SettingSection title="Tanks">
                <TanksSetting organization={organization} />
            </SettingSection>
            <SettingSection title="User Access Rights">
                <UserPrivilegesSetting organizationId={organization ? organization.id : -1} />
            </SettingSection>
            <SettingSection title="System Parameters">
                <SystemParametersSetting />
            </SettingSection>
            <SettingSection title="Logo">
                <LogoSetting organization={organization} />
            </SettingSection>
            <SettingSection title="Reference Images">
                <FrogReferencesSetting />
            </SettingSection>
        </div>
    );
}