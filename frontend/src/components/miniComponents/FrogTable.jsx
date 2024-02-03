import './FrogTable.css';

export default function FrogTable({ frogs:frogs, handleClickFrog:handleClickFrog }) {
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
        </table>
    );
}