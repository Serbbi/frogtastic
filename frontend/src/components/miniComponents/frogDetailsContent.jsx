import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./frogDetailsContent.css";
import { useNotification } from "../../hooks/NotificationProvider";
import { v4 as uuidv4 } from "uuid";

export default function FrogDetailsContent({ frog: initialFrog, goBackAction }) {
    const { addNotification } = useNotification();
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
        fetch(`http://localhost:8000/frogs/${frog.id}`, {
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
                initialFrog = frog;
                addNotification({id: uuidv4(), text: "Frog saved", type: "success" });
            })
            .catch((error) => {
                console.error('Error:', error);
                addNotification({id: uuidv4(), text: "Error saving frog", type: "error" });
            });
    }

    function deleteFrog() {
        const confirmDelete = window.confirm("Are you sure you want to delete this frog?");
        if (!confirmDelete) return;

        fetch(`http://localhost:8000/frogs/${frog.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                addNotification({id: uuidv4(), text: "Frog deleted", type: "trash" });
                goBackAction();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function injectFrog() {
        if(frog.is_laying_eggs) {
            setFrog(prevFrog => ({ ...prevFrog, is_laying_eggs: false }));
            return;
        }
        setFrog(prevFrog => ({ 
            ...prevFrog, 
            last_injection: new Date().toISOString().slice(0, 10), // this is to prevent long date format
            is_laying_eggs: true
        }));
    }

    function toggleFrogSickness() {
        setFrog(prevFrog => ({ 
            ...prevFrog, 
            is_sick: !prevFrog.is_sick
        }));
    }

    function getActualTank() {
        if (frog.is_sick) return "Quarantine";
        if (frog.is_laying_eggs) return "Egg box";
        return frog.actual_tank_id;
    }

    function checkForChanges() {
        for(let key in frog) {
            if(frog[key] !== initialFrog[key]) {
                const confirmBack = window.confirm("Are you sure you want to go back? You have unsaved changes.");
                if(confirmBack) break;
                return;
            }
        }
        goBackAction();
    }

    return (
        <div className="frogDetailsContainer">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={checkForChanges} className="goBackButton" />
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}
                {!frog.is_sick ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                      : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus"/>}
            </h1>
            <div className="leftRightContainer">
                <div className="leftDetailsContainer">
                    <div className="frogField">
                        <label htmlFor="last_injection">Last Injection</label>
                        <input type="text" id="last_injection" name="last_injection" value={frog.last_injection} onChange={updateField} />
                    </div>
                    <div className="frogField">
                        <label htmlFor="last_priming">Last Priming</label>
                        <input type="text" id="last_priming" name="last_priming" value={frog.last_priming} onChange={updateField} />
                    </div>
                    <div className="frogField">
                        <label htmlFor="notes">Notes</label>
                        <input type="text" id="notes" name="notes" value={frog.notes} onChange={updateField} />
                    </div>
                    <div className="frogField">
                        <label htmlFor="sex">Gender</label>
                        <input type="text" id="sex" name="sex" value={frog.sex} onChange={updateField} />
                    </div>
                    <div className="frogField">
                        <label htmlFor="egg_quality">Egg Quality</label>
                        <input type="text" id="egg_quality" name="egg_quality" value={frog.egg_quality} onChange={updateField} />
                    </div>
                    <div className="frogField">
                        <label htmlFor="actual_tank_id">Actual Tank</label>
                        <input type="text" name="actual_tank_id" id="actual_tank_id" value={getActualTank()} onChange={updateField} />
                    </div>
                </div>
                <div className="rightDetailsContainer">
                    <button className="saveButton" onClick={saveFrog}>Save</button>
                    <button className="saveButton" onClick={deleteFrog}>Delete</button>
                    <button className="saveButton" onClick={injectFrog}>{frog.is_laying_eggs ? "Layed eggs" : "Inject"}</button>
                    <button className="saveButton" onClick={toggleFrogSickness}>{frog.is_sick ? "Healthy" : "Sick"}</button>
                </div>
            </div>
        </div>
    );
}

FrogDetailsContent.propTypes = {
    frog: PropTypes.object.isRequired,
    goBackAction: PropTypes.func.isRequired
};