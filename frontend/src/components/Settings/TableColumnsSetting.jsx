import { useState } from 'react';
import './SettingsMenu.css';

export default function TableColumnsSetting({ frog, organization }) {
    const [showTableColumnOptions, setShowTableColumnOptions] = useState(false);
    const [listOfTableColumnsToAdd, setListOfTableColumnsToAdd] = useState([]);
    const [listOfTableColumnsToRemove, setListOfTableColumnsToRemove] = useState([]);

    async function deleteRequest() {
        const response = await fetch(`http://localhost:8000/organizations/${organization.id}/table-columns`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listOfTableColumnsToRemove)
        });

        return await response.json();
    }

    async function postRequest() {
        const response = await fetch(`http://localhost:8000/organizations/${organization.id}/table-columns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listOfTableColumnsToAdd)
        });

        return await response.json();
    }

    function selectColumn(column) {
        if(listOfTableColumnsToAdd.includes(column)) {
            setListOfTableColumnsToAdd(listOfTableColumnsToAdd.filter((item) => item !== column));
        }

        if (!listOfTableColumnsToRemove.includes(column)) {
            setListOfTableColumnsToRemove([...listOfTableColumnsToRemove, column]);
        } else {
            setListOfTableColumnsToRemove(listOfTableColumnsToRemove.filter((item) => item !== column));
        }
    }

    function handleSaveColumns() {
        if (listOfTableColumnsToAdd.length !== 0) {
            postRequest()
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        
        if (listOfTableColumnsToRemove.length !== 0) {
            deleteRequest()
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        organization.table_columns = [...organization.table_columns, ...listOfTableColumnsToAdd];
        organization.table_columns = organization.table_columns.filter(column => !listOfTableColumnsToRemove.includes(column));

        setListOfTableColumnsToAdd([]);
        setListOfTableColumnsToRemove([]);
    }

    return (
        <div className='settingContainer'>
            <h3>Frog table columns</h3>
            <hr/>
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
                <div className='predefinedAttributesContainer'>
                    <ul className='predefinedAttributes'>
                        {frog && ['frog_number', 'current_tank_id', ...Object.keys(frog.attributes)].map((option) => {
                            if (!organization.table_columns.includes(option))
                                return <li key={option} onClick={() => setListOfTableColumnsToAdd([...listOfTableColumnsToAdd, option])}>{option}</li>
                        })}
                    </ul>
                </div>
            }
            <button onClick={handleSaveColumns}>Save</button>
        </div>
    );
}