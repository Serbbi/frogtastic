import { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { frogsPutRequest } from '../../services/api/frogs/FrogsPut';
import { useNotification } from '../../services/providers/NotificationProvider';
import useClickOutside from '../../hooks/useClickOutside';
import './SettingsPage.css';

export default function FrogAttributeSettings({ frog, organization }) {
    const [addPredefinedAttribute, setAddPredefinedAttribute] = useState(false);
    const [addCustomAttribute, setAddCustomAttribute] = useState(false);
    const [customAttribute, setCustomAttribute] = useState('');
    const predefinedOptions = ["is_sick", "notes", "last_injection", "egg_quality", "weight"];
    const [listOfAttributesToAdd, setListOfAttributesToAdd] = useState([]);
    const [listOfAttributesToRemove, setListOfAttributesToRemove] = useState([]);
    const inputRef = useRef(null);
    const customInputRef = useRef(null);
    const closeInput = useCallback(() => setAddPredefinedAttribute(false), []);
    const closeCustomInput = useCallback(() => setAddCustomAttribute(false), []);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);


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

    function handleSave() {
        if (listOfAttributesToAdd.length > 0 || listOfAttributesToRemove.length > 0) {
            setIsLoading(true);
            frogsPutRequest([...listOfAttributesToAdd, ...listOfAttributesToRemove], organization.id)
                .then(() => {
                    frog.attributes = { ...frog.attributes, ...listOfAttributesToAdd.reduce((acc, attribute) => ({ ...acc, [attribute]: '' }), {}) };
                    listOfAttributesToRemove.forEach((attribute) => {
                        delete frog.attributes[attribute];
                    });

                    setListOfAttributesToAdd([]);
                    setListOfAttributesToRemove([]);

                    addNotification({ text: 'Attributes updated', type: 'success' });
                })
                .catch(() => {
                    addNotification({ text: 'Failed to update attributes', type: 'error' });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    function selectItem(attribute) {
        if (listOfAttributesToAdd.includes(attribute)) {
            setListOfAttributesToAdd(listOfAttributesToAdd.filter((item) => item !== attribute));
        }

        if (!listOfAttributesToRemove.includes(attribute)) {
            setListOfAttributesToRemove([...listOfAttributesToRemove, attribute]);
        } else {
            setListOfAttributesToRemove(listOfAttributesToRemove.filter((item) => item !== attribute));
        }
    }

    useClickOutside(inputRef, closeInput);
    useClickOutside(customInputRef, closeCustomInput);

    return (
        <>
            <p className='info-message'>Click to select attributes to remove</p>
            {frog && Object.keys(frog.attributes).length === 0 && listOfAttributesToAdd.length === 0 && (
                <p className='warning-message'>No attributes to display! Add an attribute to get started.</p>
            )}
            <ul className='attribute-list'>
                {frog && Object.keys(frog.attributes).map((key) => {
                    return <li className={`attribute-item ${listOfAttributesToRemove.includes(key) ? 'selected' : ''}`} key={key} onClick={() => selectItem(key)}>{key}</li>
                })}
                {listOfAttributesToAdd.map((key) => {
                    return <li className='attribute-item added' key={key} onClick={() => selectItem(key)}>{key}</li>
                })}
            </ul>
            <div className='setting-buttons'>
                <div className='setting-left-buttons'>
                    <button className='setting-button' onClick={() => setAddPredefinedAttribute(!addPredefinedAttribute)}>Add Predefined Attribute</button>
                    {!addCustomAttribute && <button className='setting-button' onClick={() => setAddCustomAttribute(!addCustomAttribute)}>Add Custom Attribute</button>}
                    {addPredefinedAttribute &&
                        <div className='predefined-attributes-container'>
                            <ul className='predefined-attributes-list' ref={inputRef}>
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

                    {addCustomAttribute && <div className="custom-input-container" ref={customInputRef}>
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
                        <button className='setting-button' onClick={() => { addToAttributeList(customAttribute); setCustomAttribute(""); }}>Add</button>
                    </div>}
                </div>
                <button className='setting-button save' onClick={handleSave} disabled={isLoading}>
                    {isLoading &&
                        <span className='loader'></span>}
                    <span className={isLoading ? 'invisible' : ''}>Save</span>
                </button>
            </div>
        </>
    );
}