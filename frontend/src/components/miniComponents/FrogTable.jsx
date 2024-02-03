import './FrogTable.css';

export default function FrogTable({ frogs: frogs, setShowingFrog: setShowingFrog }) {
    function handleClickFrog(frogId) {
        fetch(`http://localhost:8000/frogs/${frogId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setShowingFrog(data);
            })
            .catch(error => console.log(error));
    }

    return (
        <table className='frogTable'>
            <thead className='tableHead'>
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
                        <tr key={frog.id} className='tableRow' onClick={() => handleClickFrog(frog.id)}>
                            <td>{frog.frog_number}</td>
                            <td>{frog.last_injection}</td>
                            <td>{frog.last_priming}</td>
                            <td>{frog.notes.length > 15 ? frog.notes.substring(0, 15) + '...' : frog.notes}</td>
                            <td>{frog.sex}</td>
                            <td>{frog.egg_quality}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}