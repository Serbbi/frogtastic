import { useState } from 'react';
import useSampleFrog from '../../hooks/useSampleFrog';
import { useOrganization } from '../../hooks/OrganizationProvider';
import './SettingsMenu.css';

export default function SettingsMenu() {
    const [addPredefinedAttribute, setAddPredefinedAttribute] = useState(false);
    const [addCustomAttribute, setAddCustomAttribute] = useState(false);
    const [customAttribute, setCustomAttribute] = useState('');
    const predefinedOptions = ["isSick", "notes", "last_injection", "egg_quality", "weight"];
    const [listOfAttributesToAdd, setListOfAttributesToAdd] = useState([]);
    const [listOfAttributesToRemove, setListOfAttributesToRemove] = useState([]);
    const { organization } = useOrganization();
    const { frog } = useSampleFrog(organization ? organization.id : 1);

    const [showTableColumnOptions, setShowTableColumnOptions] = useState(false);
    const [listOfTableColumnsToAdd, setListOfTableColumnsToAdd] = useState([]);
    const [listOfTableColumnsToRemove, setListOfTableColumnsToRemove] = useState([]);

    function addToAttributeList(attribute) {
        if (!listOfAttributesToAdd.includes(attribute) && attribute !== '') {
            setListOfAttributesToAdd([...listOfAttributesToAdd, attribute]);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            addToAttributeList(customAttribute);
            setCustomAttribute('');
        }
    }

    async function deleteRequest() {
        const response = await fetch(`http://localhost:8000/frogs/organization/${organization.id}/attributes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listOfAttributesToRemove)
        });

        return await response.json();
    }

    async function postRequest() {
        const response = await fetch(`http://localhost:8000/frogs/organization/${organization.id}/attributes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listOfAttributesToAdd)
        });

        return await response.json();
    }

    function handleSave() {
        if (listOfAttributesToAdd.length !== 0) {
            postRequest()
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        
        if (listOfAttributesToRemove.length !== 0) {
            deleteRequest()
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }

        
        frog.attributes = {...frog.attributes, ...listOfAttributesToAdd.reduce((acc, attribute) => ({...acc, [attribute]: ''}), {})};
        listOfAttributesToRemove.forEach((attribute) => {
            delete frog.attributes[attribute];
        });

        setListOfAttributesToAdd([]);
        setListOfAttributesToRemove([]);
    }

    function selectItem(attribute) {
        if(listOfAttributesToAdd.includes(attribute)) {
            setListOfAttributesToAdd(listOfAttributesToAdd.filter((item) => item !== attribute));
        }

        if (!listOfAttributesToRemove.includes(attribute)) {
            setListOfAttributesToRemove([...listOfAttributesToRemove, attribute]);
        } else {
            setListOfAttributesToRemove(listOfAttributesToRemove.filter((item) => item !== attribute));
        }
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
        console.log(listOfTableColumnsToAdd);
        console.log(listOfTableColumnsToRemove);
    }

    return (
        <div className="settingsMenu">
            <h1 className='title'>Settings</h1>

            <div className='settingContainer'>
                <h3>Frog Attributes</h3>
                <hr/>
                <p>Click to select attributes to remove</p>
                <ul className='attributeList'>
                    {frog && Object.keys(frog.attributes).map((key) => {
                        return <li className={`attributeItem${listOfAttributesToRemove.includes(key) ? 'Selected' : ''}`} key={key} onClick={() => selectItem(key)}>{key}</li>
                    })}
                    {listOfAttributesToAdd.map((key) => {
                        return <li className='attributeItemAdded' key={key} onClick={() => selectItem(key)}>{key}</li>
                    })}
                </ul>
                <button onClick={() => setAddPredefinedAttribute(!addPredefinedAttribute)}>Add Predefined Attribute</button>
                <button onClick={() => setAddCustomAttribute(!addCustomAttribute)}>Add Custom Attribute</button>
                {addPredefinedAttribute && 
                    <div className='predefinedAttributesContainer'>
                        <ul className='predefinedAttributes'>
                            {frog && predefinedOptions.map((option) => {
                                if (![...Object.keys(frog.attributes), ...listOfAttributesToAdd].includes(option))
                                    return <li key={option} onClick={() => addToAttributeList(option)}>{option}</li>
                            })}
                        </ul>        
                    </div>}
                {addCustomAttribute && <input 
                        type="text" 
                        placeholder="Custom Attribute Name" 
                        value={customAttribute} 
                        onChange={(e) => setCustomAttribute(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                    />}
                <button onClick={handleSave}>Save</button>
            </div>
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
        </div>
    );
}