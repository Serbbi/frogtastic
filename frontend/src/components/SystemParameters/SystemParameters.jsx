import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SystemParameters.css';

export default function SystemParameters({ organization }) {
    const [ modifiedOrganization, setModifiedOrganization ] = useState(organization);
    const [ showCreateCard, setShowCreateCard ] = useState(false);
    const [ newParam, setNewParam ] = useState({ name: '', value: '' });

    useEffect(() => {
        if (organization) {
            setModifiedOrganization(organization);
        }
    }, [organization]);

    async function putRequest(organization) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organization.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(organization),
        })

        return response.json();
    }

    function formatLabel(label) {
        return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function updateField(event) {
        const name = event.target.previousSibling.innerText;
        const value = event.target.value;

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: { ...prevOrganization.system_parameters, [name]: value } }));
    }

    function updateNewParam(event) {
        const name = event.target.name;
        const value = event.target.value;
    
        setNewParam({ ...newParam, [name]: value });
    }

    function handleShowCreateCard() {
        setShowCreateCard(true);
    }

    function handleAddNewParam() {
        if (newParam.name === '' || newParam.value === '') {
            return;
        }
        putRequest({ ...modifiedOrganization, system_parameters: { ...modifiedOrganization.system_parameters, [newParam.name]: newParam.value } })
        .then(data => console.log(data))
        .catch(error => console.log('Error:', error));

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: { ...prevOrganization.system_parameters, [newParam.name]: newParam.value } }));
        setNewParam({ name: '', value: '' });
        setShowCreateCard(false);
    }

    function handleDeleteParam(name) {
        if (!window.confirm(`Are you sure you want to delete the parameter ${name}?`)) {
            return;
        }

        const newParams = { ...modifiedOrganization.system_parameters };
        delete newParams[name];

        putRequest({ ...modifiedOrganization, system_parameters: newParams })
        .then(data => console.log(data))
        .catch(error => console.log('Error:', error));

        setModifiedOrganization(prevOrganization => ({ ...prevOrganization, system_parameters: newParams }));
    }

    return (
        <div className="systemParamsContainer">
            <div className="titleAndButtons">
                <h1 className="title">System Parameters</h1>
                <button onClick={handleShowCreateCard}>Add Parameter</button>
            </div>
            
            <div className="systemParamsGrid">
                {showCreateCard && 
                    <div className="systemParamCard">
                        <div className='paramTypeAndAccept'>
                            <input type="text" name="name" value={newParam.name} onChange={updateNewParam} placeholder='Parameter Name'/>
                            <button onClick={handleAddNewParam} className='paramCardButton'><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                            <button onClick={() => {setShowCreateCard(false); setNewParam({ name: "", value: ""})}} className='paramCardButton'><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                        </div>
                        <input type="text" name="value" value={newParam.value} onChange={updateNewParam} placeholder='Parameter Value'/>
                    </div> 
                }
                {modifiedOrganization && Object.keys(modifiedOrganization.system_parameters).map((key) => (
                    <div key={key} className="systemParamCard">
                        <div className="paramTypeAndAccept">
                            <p>{formatLabel(key)}</p>
                            <button onClick={() => handleDeleteParam(key)} className='paramCardButton'><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                        </div>
                        <input type="text" value={modifiedOrganization.system_parameters[key]} onChange={updateField} />
                    </div>
                ))}
            </div>
        </div>
    );
}