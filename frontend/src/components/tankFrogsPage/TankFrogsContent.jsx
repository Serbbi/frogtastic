import { useState } from 'react';
import Loading from '../miniComponents/loading';
import './TankFrogsContent.css';
import FrogDetailsContent from '../miniComponents/frogDetailsContent';
import FrogTable from '../miniComponents/FrogTable';

export default function TankFrogsContent() {
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showingFrog, setShowingFrog] = useState(null);
    const [frogs, setFrogs] = useState([]);

    function handleNumberChange(event) {
        setSelectedNumber(parseInt(event.target.value));
        setIsLoading(true);
        fetch(`http://localhost:8000/frogs/tank/${event.target.value}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setFrogs(data);
                setIsLoading(false);
            })
            .catch(error => console.log(error));
    };

    function goBackAction() {
        setShowingFrog(null);
    }

    if (isLoading) return (<div className="tankFrogsContent"><Loading /></div>);

    if (showingFrog) return (<div className='intermediateContainer'><FrogDetailsContent frog={showingFrog} goBackAction={goBackAction} /></div>);

    return (
        <div className="tankFrogsContent">
            <h1>Tank Frogs</h1>
            <select id="numberSelect" value={selectedNumber} onChange={handleNumberChange} className='selectButton'>
                {[...Array(11)].map((_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            {frogs.length !== 0 && <FrogTable frogs={frogs} setShowingFrog={setShowingFrog} />}
        </div>
    );
}