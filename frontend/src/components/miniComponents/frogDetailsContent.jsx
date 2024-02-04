import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./frogDetailsContent.css";

export default function FrogDetailsContent({ frog: initialFrog, goBackAction }) {
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
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={goBackAction} className="goBackButton"/>
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}</h1>
            <div className="frogField">
                <label htmlFor="last_injection">Last Injection</label>
                <input type="text" id="last_injection" name="last_injection" value={frog.last_injection} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label htmlFor="last_priming">Last Priming</label>
                <input type="text" id="last_priming" name="last_priming" value={frog.last_priming} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label htmlFor="notes">Notes</label>
                <input type="text" id="notes" name="notes" value={frog.notes} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label htmlFor="sex">Gender</label>
                <input type="text" id="sex" name="sex" value={frog.sex} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label htmlFor="egg_quality">Egg Quality</label>
                <input type="text" id="egg_quality" name="egg_quality" value={frog.egg_quality} onChange={updateField}/>
            </div>
            <div className="frogField">
                <label htmlFor="actual_tank_id">Actual Tank</label>
                <input type="text" name="actual_tank_id" id="actual_tank_id" value={frog.actual_tank_id} onChange={updateField}/>
            </div>
            <button className="saveButton" onClick={saveFrog}>Save</button>
        </div>
    );
}

FrogDetailsContent.propTypes = {
    frog: PropTypes.object.isRequired,
    goBackAction: PropTypes.func.isRequired
};