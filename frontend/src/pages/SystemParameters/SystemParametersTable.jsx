import { useState, useMemo } from 'react';
import { useUnsavedChanges } from '../../services/providers/UnsavedChangesProvider';
import './SystemParametersTable.css';

export default function SystemParametersTable({ systemParameters, setSystemParameters, setDirtyRows, systemParameterNames, selectedRows, setSelectedRows }) {
    const { setUnsavedChanges } = useUnsavedChanges();
    const [sortDirection, setSortDirection] = useState('asc');
    const sortedParameters = useMemo(() => {
        if (!systemParameters) return [];

        return [...systemParameters].sort((a, b) => {
            const dateA = new Date(a.recorded_at || 0);
            const dateB = new Date(b.recorded_at || 0);

            return sortDirection === 'asc'
                ? dateA - dateB
                : dateB - dateA;
        });
    }, [systemParameters, sortDirection]);

    function handleValueChange(event, row) {
        const { name, value } = event.target;

        let updatedRow;

        setSystemParameters(prev => {
            const newData = prev.map(p => {
                if (p.id !== row.id) return p;

                updatedRow = {
                    ...p,
                    values: {
                        ...p.values,
                        [name]: value
                    }
                };

                return updatedRow;
            });

            return newData;
        }, false);

        setDirtyRows(prev => ({
            ...prev,
            [row.id]: updatedRow
        }));
        setUnsavedChanges(true);
    }

    function handleDateChange(event, row) {
        const newDate = event.target.value;

        let updatedRow;

        setSystemParameters(prev => {
            const newData = prev.map(p => {
                if (p.id !== row.id) return p;

                updatedRow = {
                    ...p,
                    recorded_at: newDate
                };

                return updatedRow;
            });

            return newData;
        }, false);

        setDirtyRows(prev => ({
            ...prev,
            [row.id]: updatedRow
        }));

        setUnsavedChanges(true);
    }

    function handleSelectRow(id) {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    function sortByDate() {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }

    return (
        <table className='paramsTable'>
            <thead className='tableHead'>
                <tr>
                    <th></th>
                    <th onClick={sortByDate}>Date &#8597;</th>
                    {systemParameterNames.map(param => <th key={param}>{param}</th>)}
                </tr>
            </thead>
            <tbody>
                {systemParameters && sortedParameters.map(param => (
                    <tr key={param.id}>
                        <td>
                            <input 
                                type="checkbox"
                                checked={selectedRows.has(param.id)}
                                onChange={() => handleSelectRow(param.id)} />
                        </td>
                        <td>
                            <input
                                type="date"
                                value={param.recorded_at ? param.recorded_at.split("T")[0] : ""}
                                onChange={(e) => handleDateChange(e, param)}
                            />
                        </td>
                        {Object.keys(param.values).map(value => (
                            <td key={value}><input name={value} value={param.values[value]} onChange={(e) => handleValueChange(e, param)} className='paramInput'/></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}