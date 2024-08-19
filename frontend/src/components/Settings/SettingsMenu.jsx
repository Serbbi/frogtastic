import useFrogs from '../../hooks/useFrogs';
import { useOrganization } from '../../hooks/OrganizationProvider';
import FrogAttributesSetting from './FrogAttributesSetting';
import TableColumnsSetting from './TableColumnsSetting'
import TanksSetting from './TanksSetting';
import './SettingsMenu.css';

export default function SettingsMenu() {
    const { organization } = useOrganization();
    const { frogs } = useFrogs(null, organization ? organization.id : -1, null, 1);

    return (
        <div className="settingsMenu">
            <h1 className='title'>Settings</h1>
            <FrogAttributesSetting frog={frogs ? frogs[0] : null} organization={organization}/>
            <TableColumnsSetting frog={frogs ? frogs[0] : null} organization={organization}/>
            <TanksSetting organization={organization}/>
        </div>
    );
}