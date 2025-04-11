import { useState, useEffect } from 'react';
import Loading from '../../components/miniComponents/loading';
import FrogTable from '../../components/miniComponents/FrogTable';
import useFrogs from '../../hooks/useFrogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useTanks from '../../hooks/useTanks';
import './TankFrogsPage.css';

export default function TankFrogsPage({ organization }) {
    const { tanks } = useTanks(organization ? organization.id : -1);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, selectedNumber, null);
    const [tankStatus, setTankStatus] = useState(false);

    useEffect(() => {
        if (frogs) {
            setTankStatus(frogs.some(frog => frog.attributes["is_sick"]));
        }
    }, [frogs]);

    useEffect(() => {
        if (tanks && tanks.length > 0) {
            const storedNumber = localStorage.getItem('selectedTankNumber');
            setSelectedNumber(storedNumber ? parseInt(storedNumber) : tanks[0].id);
        }
    }, [tanks]);


    function handleNumberChange(event) {
        setSelectedNumber(parseInt(event.target.value));
        localStorage.setItem('selectedTankNumber', event.target.value);
    };

    if (isLoading) return (<div className="tankFrogsContent"><Loading /></div>);

    return (
        <div className="tankFrogsContent">
            <div className="titleAndSelect">
                <h1 className='title'>Tank Frogs
                    {!tankStatus ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                        : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
                </h1>
                <select id="numberSelect" value={selectedNumber} onChange={handleNumberChange} className='selectButton'>
                    {tanks && tanks.map(tank => {
                        return <option key={tank.tank_name} value={tank.id}>{tank.tank_name}</option>
                    })}
                </select>
            </div>
            {frogs && frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization} />}
        </div>
    );
}