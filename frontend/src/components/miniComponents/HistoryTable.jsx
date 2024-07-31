import useFrog from '../../hooks/useFrog';
import './HistoryTable.css';

export default function HistoryTable({ id, setShowHistory, showHistory, tanks }) {
    const { frog, isLoading } = useFrog(id);

    function formatEventText(event) {
        if (event.includes("current_tank_id")) {
            let fromId = event.split('\'')[1][0];
            let toId = event.split('\'')[3][0];
            let fromTank = tanks.find(tank => tank.id === Number(fromId));
            fromTank ? fromTank = fromTank.tank_name : fromTank = 'Unknown Tank';
            let toTank = tanks.find(tank => tank.id === Number(toId));
            toTank ? toTank = toTank.tank_name : toTank = 'Unknown Tank';
            return `Current tank changed from ${fromTank} to ${toTank}`;
        }

        return event.charAt(0).toUpperCase() + event.slice(1).split(' ').map(word => {            
            if (word.includes('_')) return word.split('_').join(' ');
            return word;
        }).join(' ');
    }

    return (
        <div className="frogDetailsContainer">
            <h1>History</h1>
            <table className="historyTable">
                <thead>
                    <tr>
                        <th className='dateColumn'>Date</th>
                        <th>Event</th>
                    </tr>
                </thead>
                <tbody>
                    {frog && Object.entries(frog.history).map(([date, event]) => (
                        <tr key={date}>
                            <td className='dateColumn'>{date}</td>
                            <td>{event.split('\n').map((line, index) => (
                                <div key={index}>{formatEventText(line)}</div>
                            ))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>    
            <button className="saveButton" onClick={() => setShowHistory(!showHistory)}>Hide History</button>
        </div>
    );
}