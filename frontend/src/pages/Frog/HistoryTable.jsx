import useFrogs from '../../hooks/useFrogs';
import './HistoryTable.css';

export default function HistoryTable({ id, setShowHistory, showHistory, tanks }) {
    const { frog } = useFrogs(id, null, null, null);

    return (
        <div className="frogDetailsContainer">
            <div className="title-and-buttons">
                <h1 className="title">History</h1>
                <button className="primary-button all-frogs-button" onClick={() => setShowHistory(!showHistory)}>Hide History</button>
            </div>
            <table className="historyTable">
                <thead>
                    <tr>
                        <th className='dateColumn'>Date</th>
                        <th>Event</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {frog && Object.entries(frog.history).map(([date, event]) => (
                        <tr key={date}>
                            <td className='dateColumn'>{date}</td>
                            <td>{Object.entries(event).filter(([key]) => key !== 'author').map(([key, value]) => {
                                if (key === 'current_tank_id') {
                                    const tank = tanks.find(t => t.id === value);
                                    if (tank) {
                                        return (
                                            <div key={key}>
                                                <strong>current_tank:</strong> {tank.tank_name} <br />
                                            </div>
                                        );
                                    }
                                    return null;
                                }
                                return (
                                    <div key={key}>
                                        <strong>{key}:</strong> {value.toString()} <br />
                                    </div>
                                );
                            })}</td>
                            <td>{event.author}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}