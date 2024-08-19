import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SettingsMenu.css';

export default function FrogAttributeSettings({ frog, organization }) {
    const [addPredefinedAttribute, setAddPredefinedAttribute] = useState(false);
    const [addCustomAttribute, setAddCustomAttribute] = useState(false);
    const [customAttribute, setCustomAttribute] = useState('');
    const predefinedOptions = ["is_sick", "notes", "last_injection", "egg_quality", "weight"];
    const [listOfAttributesToAdd, setListOfAttributesToAdd] = useState([]);
    const [listOfAttributesToRemove, setListOfAttributesToRemove] = useState([]);
    const inputRef = useRef(null);

    async function putRequest(attributes) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs?org_q=${organization.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('site')}`
            },
            body: JSON.stringify(attributes)
        });

        return await response.json();
    }

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
        // this does not work for some reason
        if (event.key) {
            console.log("Key pressed: " + event.key);
        }
    }

    function handleSave() {
        if (listOfAttributesToAdd.length > 0 || listOfAttributesToRemove.length > 0) {
            putRequest([...listOfAttributesToAdd, ...listOfAttributesToRemove])
                .then((data) => {
                    console.log(data);
                    frog.attributes = {...frog.attributes, ...listOfAttributesToAdd.reduce((acc, attribute) => ({...acc, [attribute]: ''}), {})};
                    listOfAttributesToRemove.forEach((attribute) => {
                        delete frog.attributes[attribute];
                    });

                    setListOfAttributesToAdd([]);
                    setListOfAttributesToRemove([]);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
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

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target))
                setAddPredefinedAttribute(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    function handleAddAttribute() {
        setAddPredefinedAttribute(!addPredefinedAttribute);
    }

    return (
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
                    {/* <li key="+" className='attributeItem' onClick={handleAddAttribute} onKeyDown={handleKeyDown}>+</li> */}
                </ul>
                <button onClick={() => setAddPredefinedAttribute(!addPredefinedAttribute)}>Add Predefined Attribute</button>
                {!addCustomAttribute && <button onClick={() => setAddCustomAttribute(!addCustomAttribute)}>Add Custom Attribute</button>}
                {addPredefinedAttribute && 
                    <div className='predefinedAttributesContainer'>
                        <ul className='predefinedAttributes' ref={inputRef}>
                            {frog && new Set([...predefinedOptions].filter(x => !new Set([...Object.keys(frog.attributes)]).has(x))).size === 0 &&
                                <li>No more predefined attributes to add</li>
                            }
                            {frog && predefinedOptions.map((option) => {
                                if (![...Object.keys(frog.attributes), ...listOfAttributesToAdd].includes(option))
                                    return <li key={option} onClick={() => addToAttributeList(option)}>{option}</li>;
                                return null;
                            })}
                            {!frog && <li>Please add a frog to the database first!</li>}
                        </ul>        
                    </div>}

                {addCustomAttribute && <div className='inputContainer'>
                        <input 
                            type="text" 
                            placeholder="Custom Attribute Name" 
                            value={customAttribute} 
                            onChange={(e) => setCustomAttribute(e.target.value)} 
                            onKeyDown={handleKeyDown} 
                        />
                        <div className='icon'>
                            <FontAwesomeIcon icon="fa-solid fa-circle-question" />
                            <span className='tooltiptext'>Works best if attribute is formated like: "custom_attribute"</span>
                        </div>
                        <button onClick={() => {addToAttributeList(customAttribute); setCustomAttribute("");}}>Add</button>
                        <button onClick={() => setAddCustomAttribute(!addCustomAttribute)}>Close</button>
                    </div>}
                <button onClick={handleSave}>Save</button>
            </div>
    );
}