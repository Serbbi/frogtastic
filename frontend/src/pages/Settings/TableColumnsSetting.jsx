import { useState, useRef, useEffect } from 'react';
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import { useNotification } from '../../services/providers/NotificationProvider';
import './SettingsPage.css';

export default function TableColumnsSetting({ frog, organization }) {
    const [showTableColumnOptions, setShowTableColumnOptions] = useState(false);
    const [listOfTableColumnsToAdd, setListOfTableColumnsToAdd] = useState([]);
    const [listOfTableColumnsToRemove, setListOfTableColumnsToRemove] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const inputRef = useRef();

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowTableColumnOptions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    return (
        <div className='settingContainer'>
            <h3>Frog table columns</h3>
            <p>Click to select columns to remove</p>
            <ul className='attributeList'>
                {organization && organization.table_columns.map((column) => {
                    return <li className={`attributeItem${listOfTableColumnsToRemove.includes(column) ? 'Selected' : ''}`} key={column} onClick={() => selectColumn(column)}>{column}</li>
                })}
                {listOfTableColumnsToAdd.map((column) => {
                    return <li className='attributeItemAdded' key={column} onClick={() => selectColumn(column)}>{column}</li>
                })}
            </ul>
            <button onClick={() => setShowTableColumnOptions(!showTableColumnOptions)}>Add Table Column</button>
            {showTableColumnOptions &&
                <div className='predefinedAttributesContainer' ref={inputRef}>
                    <ul className='predefinedAttributes'>
                        {frog && ['id', 'frog_number', 'current_tank', ...Object.keys(frog.attributes)].map((option) => {
                            if (!organization.table_columns.includes(option) && !listOfTableColumnsToAdd.includes(option))
                                return <li key={option} onClick={() => setListOfTableColumnsToAdd([...listOfTableColumnsToAdd, option])}>{option}</li>;
                            return null;
                        })}
                        {!frog && <li>Please add a frog to the database first!</li>}
                        {/* {frog && [...Object.keys(frog.attributes)].length === 0 && <li>Frog has no attributes</li>} */}
                        {/* {frog && ['frog_number', 'current_tank_id', ...Object.keys(frog.attributes)].length === organization.table_columns.length && <li>No more columns to add</li>} */}
                    </ul>
                </div>
            }
            <button className='saveButtonSetting' onClick={handleSaveColumns} disabled={isLoading}>
                {isLoading &&
                    <span className='loader'></span>}
                <span className={isLoading ? 'invisible' : ''}>Save</span>
            </button>
        </div>
    );
}