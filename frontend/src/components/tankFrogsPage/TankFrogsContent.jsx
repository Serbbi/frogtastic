import { useState, useEffect } from 'react';
import Loading from '../miniComponents/loading';
import FrogTable from '../miniComponents/FrogTable';
import useTankFrogs from '../../hooks/useTankFrogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrganization } from '../../hooks/OrganizationProvider';
import useAllTanks from '../../hooks/useAllTanks';
import './TankFrogsContent.css';

export default function TankFrogsContent() {
    const { organization } = useOrganization();
    const { tanks } = useAllTanks(organization ? organization.id : -1);
    const [selectedNumber, setSelectedNumber] = useState(tanks && tanks.length > 0 ? tanks[0].id : -1);
    const { frogs, tankStatus, isLoading } = useTankFrogs({ tankId: selectedNumber });

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