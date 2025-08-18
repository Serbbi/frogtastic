import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import UseTanks from '../../hooks/useTanks';
import { useState, useEffect } from 'react';
import './FrogTable.css';

export default function FrogTable({ frogs, organization }) {
    const navigate = useNavigate();
    const { tanks } = UseTanks(organization ? organization.id : -1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [sortedFrogs, setSortedFrogs] = useState(frogs);

    useEffect(() => {
        setSortedFrogs(frogs);
    }, [frogs]);

    function formatColumnName(columnName) {
        return columnName.split('_').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ');
    }

    const sortFrogs = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...frogs].sort((a, b) => {
            if (key === "current_tank") {
                const tankA = tanks.find(tank => tank.id === a.current_tank_id)?.tank_name || '';
                const tankB = tanks.find(tank => tank.id === b.current_tank_id)?.tank_name || '';
                return direction === 'asc' ? tankA.localeCompare(tankB) : tankB.localeCompare(tankA);
            }
            if (key === "is_sick") {
                return direction === 'asc' ? a.attributes[key] - b.attributes[key] : b.attributes[key] - a.attributes[key];
            }
            if (key === "id") {
                const valueA = `F${a["frog_number"]}_T${a["tank_id"]}`;
                const valueB = `F${b["frog_number"]}_T${b["tank_id"]}`;
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            const valueA = a.attributes[key] || a[key];
            const valueB = b.attributes[key] || b[key];

            // Check if values look like dates (e.g., 'YYYY-MM-DD')
            const isDate = (val) => typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val);

            if (isDate(valueA) && isDate(valueB)) {
                const dateA = new Date(valueA);
                const dateB = new Date(valueB);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (isDate(valueA) && !isDate(valueB)) return direction === 'asc' ? -1 : 1;
            if (!isDate(valueA) && isDate(valueB)) return direction === 'asc' ? 1 : -1;

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }
            return direction === 'asc' ? valueA - valueB : valueB - valueA;
        });

        setSortedFrogs(sorted);
    };

    return (
        <table className='frogTable'>
            <thead className='tableHead'>
                <tr>
                    {organization?.table_columns.map(column => {
                        if (column === "current_tank") {
                            return <th key={column} onClick={() => sortFrogs(column)}>Tank</th>;
                        }
                        if (column === "is_sick") {
                            return <th key={column} onClick={() => sortFrogs(column)}>Health Status</th>
                        }
                        return <th key={column} onClick={() => sortFrogs(column)}>{formatColumnName(column)}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {tanks && sortedFrogs.map((frog, index) => {
                    return (
                        <tr key={frog.id} className={"tableRow" + (index % 2 === 0 ? " even" : " odd")} onClick={() => navigate(`/home/frog/${frog.id}`, { state: "from table" })}>
                            {organization?.table_columns.map(column => {
                                if (column === "id")
                                    return <td key={column}>F{frog["frog_number"]}_T{frog["tank_id"]}</td>;
                                if (column === "frog_number")
                                    return <td key={column}>{frog[column]}</td>;
                                if (column === "current_tank") {
                                    return <td key={column}>{tanks.find(tank => tank.id === frog.current_tank_id) ? tanks.find(tank => tank.id === frog.current_tank_id).tank_name : null}</td>;
                                }
                                if (column === "is_sick")
                                    return frog.attributes[column] ? <td key={column}><FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" /></td>
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