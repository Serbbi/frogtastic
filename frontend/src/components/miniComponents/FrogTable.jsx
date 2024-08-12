import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import UseAllTanks from '../../hooks/useAllTanks';
import './FrogTable.css';

export default function FrogTable({ frogs, organization }) {
    const navigate = useNavigate();
    const { tanks } = UseAllTanks(organization.id);

    function formatColumnName(columnName) {
        return columnName.split('_').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ');
    }

    return (
        <table className='frogTable'>
            <thead className='tableHead'>
                <tr>
                    {organization.table_columns.map(column => {
                        if (column === "current_tank") return <th key={column}>Tank</th>;
                        return <th key={column}>{formatColumnName(column)}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {frogs.map(frog => {
                    return (
                        <tr key={frog.id} className='tableRow' onClick={() => navigate(`/home/frog/${frog.id}`)}>
                            {organization.table_columns.map(column => {
                                if(column === "frog_number") 
                                    return <td key={column}>{frog[column]}</td>;
                                if(column === "current_tank") {
                                    if (frog.current_tank_id === null) return <td key={column}></td>;
                                    return <td key={column}>{tanks.find(tank => tank.id === frog.current_tank_id).tank_name}</td>;
                                }
                                if(column === "is_sick") 
                                    return frog.attributes[column] ? <td key={column}><FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus"/></td>
                                        : <td key={column}><FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" /></td>;
                                return <td key={column}>{frog.attributes[column]}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

FrogTable.propTypes = {
    frogs: PropTypes.array.isRequired,
};