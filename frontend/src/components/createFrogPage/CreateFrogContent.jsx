import { useState } from 'react';
import './CreateFrogContent.css';

export default function CreateFrogContent() {
    const token = localStorage.getItem('site');
    const [frog, setFrog] = useState({
        frog_number: 0,
        tank_id: 0,
        last_injection: "",
        last_priming: "",
        notes: "",
        sex: "",
        egg_quality: 0,
    });


    function updateField(event) {
        const name = event.target.name;
        let value = event.target.value;
        if(name === "frog_number" || name === "tank_id" || name === "egg_quality" || name === "actual_tank_id") {
            value = parseInt(value);
        }
        setFrog(prevFrog => ({ ...prevFrog, [name]: value }));
    }

    function saveFrog() {
        console.log(frog);
        fetch('http://localhost:8000/frogs/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frog)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="createFrogContainer">
            <h1>Create Frog</h1>
            <div className="frogField">
                <label htmlFor="frogNumberInput">Frog Number</label>
                <input type="text" id="frogNumberInput" name="frog_number" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="tankIdInput">Tank</label>
                <input type="text" id="tankIdInput" name="tank_id" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="lastInjectionInput">Last Injection</label>
                <input type="text" id="lastInjectionInput" name="last_injection" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="lastPrimingInput">Last Priming</label>
                <input type="text" id="lastPrimingInput" name="last_priming" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="notesInput">Notes</label>
                <input type="text" id="notesInput" name="notes" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="genderInput">Gender</label>
                <input type="text" id="genderInput" name="sex" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="eggQualityInput">Egg Quality</label>
                <input type="text" id="eggQualityInput" name="egg_quality" onChange={updateField} />
            </div>
            <div className="frogField">
                <label htmlFor="actualTankIdInput">Current Tank</label>
                <input type="text" id="actualTankIdInput" name="actual_tank_id" onChange={updateField} />
            </div>
            <button className="saveButton" onClick={saveFrog}>Save</button>
        </div>
    );
}