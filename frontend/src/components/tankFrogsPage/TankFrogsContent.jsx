import { useState, useEffect } from 'react';
import Loading from '../miniComponents/loading';
import FrogTable from '../miniComponents/FrogTable';
import useFrogs from '../../hooks/useFrogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrganization } from '../../hooks/OrganizationProvider';
import useTanks from '../../hooks/useTanks';
import './TankFrogsContent.css';

export default function TankFrogsContent() {
    const { organization } = useOrganization();
    const { tanks } = useTanks(organization ? organization.id : -1);
    const [selectedNumber, setSelectedNumber] = useState(tanks && tanks.length > 0 ? tanks[0].id : -1);
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, selectedNumber, null);
    const [ tankStatus, setTankStatus ] = useState(false);

    useEffect(() => {
        if(frogs) {
            setTankStatus(frogs.some(frog => frog.attributes["is_sick"]));
        }
    }, [frogs]);

    useEffect(() => {
        setSelectedNumber(tanks && tanks.length > 0 ? tanks[0].id : -1);
    }, [organization, tanks]);


    function handleNumberChange(event) {
        setSelectedNumber(parseInt(event.target.value));
    };

    if (isLoading) return (<div className="tankFrogsContent"><Loading /></div>);

    return (
        <div className="tankFrogsContent">
            <h1>Tank Frogs
                {!tankStatus ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                    : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
            </h1>
            <select id="numberSelect" value={selectedNumber} onChange={handleNumberChange} className='selectButton'>
                {tanks && tanks.map(tank => {
                    return <option key={tank.tank_name} value={tank.id}>{tank.tank_name}</option>
                })}
            </select>
            {frogs && frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization}/>}
        </div>
    );
}