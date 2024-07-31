import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import useFrog from '../../hooks/useFrog';
import { useState, useEffect } from 'react';
import './FrogTable.css';

export default function FrogTable({ frogs, setShowingFrog, organization }) {
    const [frogId, setFrogId] = useState(null);

    const { frog, isLoading } = useFrog(frogId);

    useEffect(() => {
        if(!isLoading) {
            setShowingFrog(frog);
        }
    }, [isLoading, frog]);

    function formatColumnName(columnName) {
        return columnName.split('_').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ');
    }

    return (
        <table className='frogTable'>
            <thead className='tableHead'>
                <tr>
                    {organization.table_columns.map(column => {
                        return <th key={column}>{formatColumnName(column)}</th>
                    })}
                    {/* <th>Frog Number</th>
                    <th>Tank</th>
                    <th>Current Tank</th>
                    <th>Last Injection</th>
                    <th>Notes</th>
                    <th>Status</th> */}
                </tr>
            </thead>
            <tbody>
                {frogs.map(frog => {
                    return (
                        <tr key={frog.id} className='tableRow' onClick={() => setFrogId(frog.id)}>
                            {organization.table_columns.map(column => {
                                if(column === "frog_number" || column === "current_tank_id") 
                                    return <td key={column}>{frog[column]}</td>;
                                if(column === "is_sick") 
                                    return frog.attributes[column] ? <td key={column}><FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus"/></td>
                                        : <td key={column}><FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" /></td>;
                                return <td key={column}>{frog.attributes[column]}</td>;
                            })}
                            {/* <td>{frog.frog_number}</td>
                            <td>{frog.tank_id}</td>
                            <td>{frog.current_tank_id}</td>
                            <td>{frog.last_injection}</td>
                            <td>{(frog.notes && frog.notes.length > 15) ? frog.notes.substring(0, 15) + '...' : frog.notes}</td>
                            <td>{frog.is_sick ? <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus"/>
                                              : <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />}
                            </td> */}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

FrogTable.propTypes = {
    frogs: PropTypes.array.isRequired,
    setShowingFrog: PropTypes.func.isRequired,
};