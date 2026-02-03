import { useState, useRef, useCallback } from 'react';
import useTanks from '../../hooks/useTanks';
import { tanksDeleteRequest } from '../../services/api/tanks/TanksDelete';
import { tanksPostRequest } from '../../services/api/tanks/TanksPost';
import { tanksPutRequest } from '../../services/api/tanks/TanksPut';
import { useNotification } from '../../services/providers/NotificationProvider';
import useClickOutside from '../../hooks/useClickOutside';
import './SettingsPage.css';

export default function TanksSetting({ organization }) {
    const [showInputNewTank, setShowInputNewTank] = useState(false);
    const [newTankName, setNewTankName] = useState("");
    const [editingItemId, setEditingItemId] = useState(null);
    const { tanks, mutate } = useTanks(organization ? organization.id : []);
    const { addNotification } = useNotification();
    const inputRef = useRef(null);
    const customInputRef = useRef(null);
    const closeInput = useCallback(() => setShowInputNewTank(false), []);
    const closeCustomInput = useCallback(() => setShowInputNewTank(false), []);

    function addTank() {
        if (newTankName === "" || newTankName.trim() === "" || organization === null) return;
        const tank = {
            "tank_name": newTankName,
            "organization_id": organization.id,
            "frog_ids": [],
            "attributes": {}
        };
        tanksPostRequest(tank)
            .then(() => addNotification({ text: 'Tank added', type: 'success' }))
            .catch(() => addNotification({ text: 'Failed to add tank', type: 'error' }));

        tanks.push(tank);
        mutate(tanks, false);
        setShowInputNewTank(!showInputNewTank);
        setNewTankName("");
    }

    function handleEditClick(tankId, tankName) {
        setNewTankName(tankName);
        setEditingItemId(tankId);
    }

    function handleSaveClick(tank) {
        if (newTankName === "") return;
        tank.tank_name = newTankName;
        tanksPutRequest(tank)
            .then(() => addNotification({ text: 'Tank updated', type: 'success' }))
            .catch(() => addNotification({ text: 'Failed to update tank', type: 'error' }));

        setEditingItemId(null);
        setNewTankName("");
    }

    function handleDeleteClick(tankId) {
        tanksDeleteRequest(tankId)
            .then(() => addNotification({ text: 'Tank deleted', type: 'success' }))
            .catch(() => addNotification({ text: 'Failed to delete tank', type: 'error' }));

        setEditingItemId(null);
        setNewTankName("");
        mutate(tanks.filter(tank => tank.id !== tankId), false);
    }

    useClickOutside(inputRef, closeInput);
    useClickOutside(customInputRef, closeCustomInput);

    return (
        <>
            <p className='info-message'>Click to select a tank to edit</p>
            {tanks && tanks.length === 0 && <p className='warning-message'>No tanks set!</p>}
            <ul className='attribute-list'>
                {tanks && tanks.map(tank =>
                    editingItemId === tank.id ?
                        <li key={tank.id} ref={inputRef} className='custom-input-container'>
                            <input value={newTankName} onChange={(e) => setNewTankName(e.target.value)} />
                            <button className='setting-button' onClick={() => handleSaveClick(tank)}>Save</button>
                            <button className='setting-button' onClick={() => handleDeleteClick(tank.id)}>Delete</button>
                        </li>
                        :
                        <li key={tank.id} className="attribute-item editable" >
                            <span onClick={() => handleEditClick(tank.id, tank.tank_name)}>{tank.tank_name}</span>
                        </li>
                )}
            </ul>
            <div className='setting-buttons'>
                {!showInputNewTank && <button className='setting-button' onClick={() => setShowInputNewTank(!showInputNewTank)}>Add New Tank</button>}
                {showInputNewTank && <div className='custom-input-container' ref={customInputRef}>
                    <input placeholder="New tank name" onChange={(e) => setNewTankName(e.target.value)} />
                    <button className='setting-button' onClick={addTank}>Add</button>
                </div>}
            </div>
        </>
    );
}
