import useFrogs from '../../hooks/useFrogs';
import './HistoryTable.css';

export default function HistoryTable({ id, setShowHistory, showHistory, tanks }) {
    const { frog } = useFrogs(id, null, null, null);


    function formatEventText(event) {
        if (event.includes("current_tank_id")) {
            let fromId = event.match(/'([^']+)'/)[1];
            let toId = event.match(/'([^']+)'/g)[1].replace(/'/g, '');
            let fromTank = tanks.find(tank => tank.id === Number(fromId));
            fromTank ? fromTank = fromTank.tank_name : fromTank = 'Unknown Tank';
            let toTank = tanks.find(tank => tank.id === Number(toId));
            toTank ? toTank = toTank.tank_name : toTank = 'Unknown Tank';
            return `${event.split(' ')[0]} changed the current tank from ${fromTank} to ${toTank}`;
        }
        return event;
    }

    return (
        <div className="frogDetailsContainer">
            <h1>History</h1>
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
                            <td>{Object.entries(event).filter(([key]) => key !== 'author').map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key}:</strong> {value} <br />
                                </div>
                            ))}</td>
                            <td>{event.author}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="primary-button frog-page-button" onClick={() => setShowHistory(!showHistory)}>Hide History</button>
        </div>
    );
}