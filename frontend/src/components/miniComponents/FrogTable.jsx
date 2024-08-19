import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import UseTanks from '../../hooks/useTanks';
import './FrogTable.css';

export default function FrogTable({ frogs, organization }) {
    const navigate = useNavigate();
    const { tanks } = UseTanks(organization ? organization.id : -1);

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
                </tr>
            </thead>
            <tbody>
                {tanks && frogs.map(frog => {
                    return (
                        <tr key={frog.id} className='tableRow' onClick={() => navigate(`/home/frog/${frog.id}`)}>
                            {organization.table_columns.map(column => {
                                if(column === "frog_number") 
                                    return <td key={column}>{frog[column]}</td>;
                                if(column === "current_tank") {
                                    return <td key={column}>{tanks.find(tank => tank.id === frog.current_tank_id) ? tanks.find(tank => tank.id === frog.current_tank_id).tank_name : null}</td>;
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