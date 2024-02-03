import { useState } from 'react';
import Loading from './loading';
import './TankFrogsContent.css';
import FrogDetailsContent from './frogDetailsContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    function handleClickFrog(event) {
        const frogNumber = event.target.parentElement.firstChild.innerText;
        fetch(`http://localhost:8000/frogs/${frogNumber}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setShowingFrog(data);
            })
            .catch(error => console.log(error));
    }

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
            {frogs.length !== 0 && <table>
                <thead>
                    <tr>
                        <th>Frog Number</th>
                        <th>Last Injection</th>
                        <th>Last Priming</th>
                        <th>Notes</th>
                        <th>Gender</th>
                        <th>Egg Quality</th>
                    </tr>
                </thead>
                <tbody>
                    {frogs.map(frog => {
                        return (
                            <tr key={frog.frog_number} className='tableRow' onClick={handleClickFrog}>
                                <td>{frog.frog_number}</td>
                                <td>{frog.last_injection}</td>
                                <td>{frog.last_priming}</td>
                                <td>{frog.notes}</td>
                                <td>{frog.sex}</td>
                                <td>{frog.egg_quality}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>}

        </div>
    );
}