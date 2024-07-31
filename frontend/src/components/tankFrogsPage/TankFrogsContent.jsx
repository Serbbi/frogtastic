import { useState } from 'react';
import Loading from '../miniComponents/loading';
import FrogDetailsContent from '../miniComponents/frogDetailsContent';
import FrogTable from '../miniComponents/FrogTable';
import useTankFrogs from '../../hooks/useTankFrogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrganization } from '../../hooks/OrganizationProvider';
import useAllTanks from '../../hooks/useAllTanks';
import './TankFrogsContent.css';

export default function TankFrogsContent() {
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [showingFrog, setShowingFrog] = useState(null);
    const { frogs, tankStatus, isLoading } = useTankFrogs({ tankId: selectedNumber });
    const { organization } = useOrganization();
    const { tanks } = useAllTanks(organization ? organization.id : -1);

    function handleNumberChange(event) {
        setSelectedNumber(parseInt(event.target.value));
    };

    function goBackAction() {
        setShowingFrog(null);
    }

    if (isLoading) return (<div className="tankFrogsContent"><Loading /></div>);

    if (showingFrog) return (<div className='intermediateContainer'><FrogDetailsContent frog={showingFrog} goBackAction={goBackAction} /></div>);

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
            {frogs && frogs.length !== 0 && <FrogTable frogs={frogs} setShowingFrog={setShowingFrog} organization={organization}/>}
        </div>
    );
}