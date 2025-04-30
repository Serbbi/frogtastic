import useFrogs from '../../hooks/useFrogs';
import { useOrganization } from '../../services/providers/OrganizationProvider';
import FrogAttributesSetting from './FrogAttributesSetting';
import TableColumnsSetting from './TableColumnsSetting'
import TanksSetting from './TanksSetting';
import UserPrivilegesSetting from './UserPrivilegesSetting';
import './SettingsPage.css';
import SystemParametersSetting from './SystemParametersSetting';

export default function SettingsPage() {
    const { organization } = useOrganization();
    const { frogs } = useFrogs(null, organization ? organization.id : -1, null, 1);

    return (
        <div className="settingsMenu">
            <h1 className='title'>Settings</h1>
            <div className="settingsGrid">
                <FrogAttributesSetting frog={frogs ? frogs[0] : null} organization={organization} />
                <TableColumnsSetting frog={frogs ? frogs[0] : null} organization={organization} />
                <TanksSetting organization={organization} />
                <UserPrivilegesSetting organizationId={organization ? organization.id : -1} />
                <SystemParametersSetting />
            </div>
        </div>
    );
}