import { useState, useRef, useCallback } from 'react';
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import { useNotification } from '../../services/providers/NotificationProvider';
import useClickOutside from '../../hooks/useClickOutside';
import './SettingsPage.css';

export default function TableColumnsSetting({ frog, organization }) {
    const [showTableColumnOptions, setShowTableColumnOptions] = useState(false);
    const [listOfTableColumnsToAdd, setListOfTableColumnsToAdd] = useState([]);
    const [listOfTableColumnsToRemove, setListOfTableColumnsToRemove] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const inputRef = useRef();
    const closeInput = useCallback(() => setShowTableColumnOptions(false), []);

    function selectColumn(column) {
        if (listOfTableColumnsToAdd.includes(column)) {
            setListOfTableColumnsToAdd(listOfTableColumnsToAdd.filter((item) => item !== column));
        }

        if (!listOfTableColumnsToRemove.includes(column)) {
            setListOfTableColumnsToRemove([...listOfTableColumnsToRemove, column]);
        } else {
            setListOfTableColumnsToRemove(listOfTableColumnsToRemove.filter((item) => item !== column));
        }
    }

    function handleSaveColumns() {
        if (organization === null) return;
        organization.table_columns = [...organization.table_columns, ...listOfTableColumnsToAdd];
        organization.table_columns = organization.table_columns.filter(column => !listOfTableColumnsToRemove.includes(column));

        setIsLoading(true);
        organizationPutRequest(organization)
            .then(() => { addNotification({ text: 'Table columns updated', type: 'success' }); })
            .catch(() => { addNotification({ text: 'Failed to update table columns', type: 'error' }); })
            .finally(() => {
                setIsLoading(false);
            });

        setListOfTableColumnsToAdd([]);
        setListOfTableColumnsToRemove([]);
    }

    useClickOutside(inputRef, closeInput);

    return (
        <>
            <p className='info-message'>Click to select columns to remove</p>
            {organization && organization.table_columns.length === 0 && listOfTableColumnsToAdd.length === 0 && <p className='warning-message'>No table columns set!</p>}
            <ul className='attribute-list'>
                {organization && organization.table_columns.map((column) => {
                    return <li className={`attribute-item${listOfTableColumnsToRemove.includes(column) ? ' selected' : ''}`} key={column} onClick={() => selectColumn(column)}>{column}</li>
                })}
                {listOfTableColumnsToAdd.map((column) => {
                    return <li className='attribute-item added' key={column} onClick={() => selectColumn(column)}>{column}</li>
                })}
            </ul>
            <div className='setting-buttons'>
                <button className='setting-button' onClick={() => setShowTableColumnOptions(!showTableColumnOptions)}>Add Table Column</button>
                {showTableColumnOptions &&
                    <div className='predefined-attributes-container' ref={inputRef}>
                        <ul className='predefined-attributes-list'>
                            {frog && ['id', 'frog_number', 'current_tank', ...Object.keys(frog.attributes)].map((option) => {
                                if (!organization.table_columns.includes(option) && !listOfTableColumnsToAdd.includes(option))
                                    return <li key={option} onClick={() => setListOfTableColumnsToAdd([...listOfTableColumnsToAdd, option])}>{option}</li>;
                                return null;
                            })}
                            {!frog && <li>Please add a frog to the database first!</li>}
                            {frog && ['frog_number', 'current_tank_id', ...Object.keys(frog.attributes)].length === organization.table_columns.length + listOfTableColumnsToAdd.length - 1 && <li>No more columns to add</li>}
                        </ul>
                    </div>
                }
                <button className='setting-button save' onClick={handleSaveColumns} disabled={isLoading}>
                    {isLoading &&
                        <span className='loader'></span>}
                    <span className={isLoading ? 'invisible' : ''}>Save</span>
                </button>
            </div>
        </>
    );
}