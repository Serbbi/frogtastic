import { useState, useEffect, useRef } from 'react';
import useAllTanks from '../../hooks/useAllTanks';
import './SettingsMenu.css';

export default function TanksSetting({ organization }) {
    const [showInputNewTank, setShowInputNewTank] = useState(false);
    const [newTankName, setNewTankName] = useState("");
    const [editingItemId, setEditingItemId] = useState(null);
    const { tanks } = useAllTanks(organization.id);
    const inputRef = useRef(null);

    async function putRequest(tank) {
        const response = await fetch(`http://localhost:8000/tanks/${tank.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tank)
        });

        return await response.json();
    }

    async function deleteRequest(tankId) {
        const response = await fetch(`http://localhost:8000/tanks/${tankId}`, {
            method: 'DELETE'
        });

        return await response.json();
    }

    async function postRequest(tank) {
        const response = await fetch(`http://localhost:8000/tanks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tank)
        });

        return await response.json();
    }

    function addTank() {
        if (newTankName === "") return;
        const tank = {
            "tank_name": newTankName,
            "organization_id": organization.id,
            "frog_ids": [],
            "attributes": {}
        };
        postRequest(tank)
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        tanks.push(tank);
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
        putRequest(tank)
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });

        setEditingItemId(null);
        setNewTankName("");
    }

    function handleDeleteClick(tankId) {
        deleteRequest(tankId)
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });

        setEditingItemId(null);
        setNewTankName("");
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
            <hr />
            <p>Click to select a tank to edit</p>
            <ul className='attributeList'>
                {tanks && tanks.map(tank =>
                    editingItemId === tank.id ?
                        <div key={tank.id} ref={inputRef} className='editTankDiv'>
                            <input value={newTankName} id='editTankInput' onChange={(e) => setNewTankName(e.target.value)} />
                            <button onClick={() => handleSaveClick(tank)}>Save</button>
                            <button onClick={() => handleDeleteClick(tank.id)}>Delete</button>
                        </div>
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
