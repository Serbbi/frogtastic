import { useOrganization } from '../../services/providers/OrganizationProvider';
import { organizationPutRequest } from '../../services/api/organizations/OrganizationPut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotification } from '../../services/providers/NotificationProvider';
import { useCallback, useState, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import './SettingsPage.css';

export default function SystemParametersSetting() {
    const { organization } = useOrganization();
    const [selectedParameters, setSelectedParameters] = useState([]);
    const [addCustomParameter, setAddCustomParameter] = useState(false);
    const [customParameter, setCustomParameter] = useState('');
    const [listOfParametersToAdd, setListOfParametersToAdd] = useState([]);
    const { addNotification } = useNotification();
    const closeCustomInput = useCallback(() => setAddCustomParameter(false), []);
    const customInputRef = useRef(null);

    function addToParameterList(parameter) {
        if (!listOfParametersToAdd.includes(parameter) && parameter !== '') {
            setListOfParametersToAdd([...listOfParametersToAdd, parameter]);
        }
    }

    function selectItem(parameter) {
        if (selectedParameters.includes(parameter)) {
            setSelectedParameters(selectedParameters.filter((item) => item !== parameter));
        } else {
            setSelectedParameters([...selectedParameters, parameter]);
        }

        if (listOfParametersToAdd.includes(parameter)) {
            setListOfParametersToAdd(listOfParametersToAdd.filter((item) => item !== parameter));
        }
    }

    function handleSave() {
        organization.system_parameter_names = organization.system_parameter_names.filter((parameter) => !selectedParameters.includes(parameter));
        Object.keys(organization.system_parameters).forEach((date) => {
            organization.system_parameters[date] = Object.fromEntries(Object.entries(organization.system_parameters[date]).filter(([key, value]) => !selectedParameters.includes(key)));
        });
        listOfParametersToAdd.forEach((parameter) => {
            organization.system_parameter_names.push(parameter);
            Object.keys(organization.system_parameters).forEach((date) => {
                organization.system_parameters[date][parameter] = '';
            });
        });
        organizationPutRequest(organization)
            .then(() => {
                setSelectedParameters([]);
                window.location.reload(); // for now
            })
            .catch((error) => addNotification({ text: error.message, type: "error" }));
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            addToParameterList(customParameter);
            setCustomParameter('');
        }
    }

    useClickOutside(customInputRef, closeCustomInput);

    if (!organization) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <p className='info-message'>Click to select parameters to remove</p>
            {organization.system_parameter_names.length === 0 && listOfParametersToAdd.length === 0 && (
                <p className='warning-message'>No system parameters defined!</p>
            )}
            <ul className='attribute-list'>
                {organization.system_parameter_names.map((parameter) => (
                    <li key={parameter} className={`attribute-item${selectedParameters.includes(parameter) ? ' selected' : ''}`} onClick={() => selectItem(parameter)}>{parameter}</li>
                ))}
                {listOfParametersToAdd.map((parameter) => (
                    <li key={parameter} className='attribute-item added' onClick={() => selectItem(parameter)}>{parameter}</li>
                ))}
            </ul>
            <div className='setting-buttons'>
                {!addCustomParameter && <button className='setting-button' onClick={() => setAddCustomParameter(!addCustomParameter)}>Add Custom Parameter</button>}
                {addCustomParameter && <div className="custom-input-container" ref={customInputRef}>
                    <input
                        type="text"
                        placeholder="Custom Attribute Name"
                        value={customParameter}
                        onChange={(e) => setCustomParameter(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className='icon'>
                        <FontAwesomeIcon icon="fa-solid fa-circle-question" />
                        <span className='tooltiptext'>Works best if attribute is formated like: "custom_parameter"</span>
                    </div>
                    <button className='setting-button' onClick={() => { addToParameterList(customParameter); setCustomParameter(""); }}>Add</button>
                </div>}
                <button className='setting-button save' onClick={() => handleSave()}>Save</button>
            </div>
        </>
    );
}