import useSampleFrog from '../../hooks/useSampleFrog';
import { useOrganization } from '../../hooks/OrganizationProvider';
import FrogAttributesSetting from './FrogAttributesSetting';
import TableColumnsSetting from './TableColumnsSetting'
import TanksSetting from './TanksSetting';
import './SettingsMenu.css';

export default function SettingsMenu() {
    const { organization } = useOrganization();
    const { frog } = useSampleFrog(organization ? organization.id : -1);

    return (
        <div className="settingsMenu">
            <h1 className='title'>Settings</h1>
            <FrogAttributesSetting frog={frog} organization={organization}/>
            <TableColumnsSetting frog={frog} organization={organization}/>
            <TanksSetting organization={organization}/>
        </div>
    );
}