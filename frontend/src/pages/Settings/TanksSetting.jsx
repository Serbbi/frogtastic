import { useState, useEffect, useRef } from 'react';
import useTanks from '../../hooks/useTanks';
import { tanksDeleteRequest } from '../../services/api/tanks/TanksDelete';
import { tanksPostRequest } from '../../services/api/tanks/TanksPost';
import { tanksPutRequest } from '../../services/api/tanks/TanksPut';
import { useNotification } from '../../services/providers/NotificationProvider';
import './SettingsPage.css';

export default function TanksSetting({ organization }) {
    const [showInputNewTank, setShowInputNewTank] = useState(false);
    const [newTankName, setNewTankName] = useState("");
    const [editingItemId, setEditingItemId] = useState(null);
    const { tanks, mutate } = useTanks(organization ? organization.id : []);
    const { addNotification } = useNotification();
    const inputRef = useRef(null);

    function addTank() {
        if (newTankName === "" || newTankName.trim() === "") return;
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

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setEditingItemId(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    return (
        <div className='settingContainer'>
            <h3>Tanks</h3>
            {/* <hr /> */}
            <p>Click to select a tank to edit</p>
            <ul className='attributeList'>
                {tanks && tanks.map(tank =>
                    editingItemId === tank.id ?
                        <li key={tank.id} ref={inputRef} className='editTankDiv'>
                            <input value={newTankName} id='editTankInput' onChange={(e) => setNewTankName(e.target.value)} />
                            <button onClick={() => handleSaveClick(tank)}>Save</button>
                            <button onClick={() => handleDeleteClick(tank.id)}>Delete</button>
                        </li>
                        :
                        <li key={tank.id} className="attributeItem" >
                            <span onClick={() => handleEditClick(tank.id, tank.tank_name)}>{tank.tank_name}</span>
                        </li>
                )}
            </ul>
            {!showInputNewTank && <button onClick={() => setShowInputNewTank(!showInputNewTank)}>Add New Tank</button>}
            {showInputNewTank && <div>
                <input onChange={(e) => setNewTankName(e.target.value)} />
                <button onClick={addTank}>Add</button>
                <button onClick={() => setShowInputNewTank(!showInputNewTank)}>Close</button>
            </div>}
        </div>
    );
}
