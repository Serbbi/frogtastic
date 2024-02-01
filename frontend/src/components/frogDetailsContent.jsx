import { useState, useEffect } from "react";
import "./frogDetailsContent.css";

export default function FrogDetailsContent({ frog: initialFrog }) {
    const token = localStorage.getItem('site');
    const [frog, setFrog] = useState(initialFrog);

    useEffect(() => {
        setFrog(initialFrog);
    }, [initialFrog]);

    function updateField(event) {
        const name = event.target.name;
        const value = event.target.value;
        setFrog(prevFrog => ({ ...prevFrog, [name]: value }));
    }

    function saveFrog() {
        fetch(`http://localhost:8000/frogs/${frog.frog_number}`, {
            method: 'PUT',
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
        <div className="frogDetailsContainer">
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}</h1>
            <div className="frogField">
                <label>Last Injection</label>
                <input type="text" name="last_injection" value={frog.last_injection} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label>Last Priming</label>
                <input type="text" name="last_priming" value={frog.last_priming} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label>Notes</label>
                <input type="text" name="notes" value={frog.notes} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label>Gender</label>
                <input type="text" name="sex" value={frog.sex} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label>Egg Quality</label>
                <input type="text" name="egg_quality" value={frog.egg_quality} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label>Actual Tank</label>
                <input type="text" name="actual_tank_id" value={frog.actual_tank_id} onChange={updateField}/>
            </div>
            <button className="saveButton" onClick={saveFrog}>Save</button>
        </div>
    );
}