import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../hooks/NotificationProvider";
import { v4 as uuidv4 } from "uuid";
import { throwIfNotOk } from "../../util/errorThrower";
import "./frogDetailsContent.css";

export default function FrogDetailsContent({ frog: initialFrog, goBackAction }) {
    const { addNotification } = useNotification();
    const token = localStorage.getItem('site');
    const [frog, setFrog] = useState(initialFrog);
    const [ saved, setSaved ] = useState(true);

    console.log(frog);

    function updateField(event) {
        const name = event.target.name;
        const value = event.target.value;

        const newDict = { ...frog.dict, [name]: value };

        setFrog(prevFrog => ({ ...prevFrog, dict: newDict }));
        setSaved(false);
    }

    async function updateRequest(frog) {
        const response = await fetch(`http://localhost:8000/frogs/${frog.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(frog)
        });

        throwIfNotOk(response);

        return await response.json();
    }

    function saveFrog() {
        updateRequest(frog)
            .then(data => {
                setSaved(true);
                addNotification({ id: uuidv4(), text: "Frog saved", type: "success" });
            })
            .catch((error) => {
                addNotification({ id: uuidv4(), text: error.message, type: "error" });
            });
    }

    async function deleteRequest(frog) {
        const response = await fetch(`http://localhost:8000/frogs/${frog.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
            
        throwIfNotOk(response);

        return await response.json();
    }

    function deleteFrog() {
        const confirmDelete = window.confirm("Are you sure you want to delete this frog?");
        if (!confirmDelete) return;

        deleteRequest(frog)
            .then(data => {
                addNotification({ id: uuidv4(), text: "Frog deleted", type: "trash" });
                goBackAction();
            })
            .catch((error) => {
                addNotification({ id: uuidv4(), text: error.message, type: "error" });
            });
    }

    function injectFrog() {
        if (frog.is_laying_eggs) {
            setFrog(prevFrog => ({ ...prevFrog, is_laying_eggs: false }));
            return;
        }
        setFrog(prevFrog => ({
            ...prevFrog,
            last_injection: new Date().toISOString().slice(0, 10), // this is to prevent long date format
            is_laying_eggs: true
        }));
        setSaved(false);
    }

    function toggleFrogSickness() {
        setFrog(prevFrog => ({
            ...prevFrog,
            is_sick: !prevFrog.is_sick
        }));
        setSaved(false);
    }

    function getActualTank() {
        if (frog.is_sick) return "Quarantine";
        if (frog.is_laying_eggs) return "Egg box";
        return frog.actual_tank_id ? frog.actual_tank_id : "";
    }

    function checkForChanges() {
        if (!saved) {
            const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) return;
        }
        goBackAction();
    }

    return (
        <div className="frogDetailsContainer">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={checkForChanges} className="goBackButton" />
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}
                {!frog.is_sick ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                    : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
            </h1>
            <div className="leftRightContainer">
                <div className="leftDetailsContainer">
                    {Object.entries(frog.attributes).map(([key, value]) => (
                        <div className="frogField">
                            <label>{key}</label>
                            <input type="text" name={key} value={value} onChange={updateField} />
                        </div>
                    ))}
                </div>
                <div className="rightDetailsContainer">
                    <button className="saveButton" onClick={saveFrog}>Save</button>
                    <button className="saveButton" onClick={deleteFrog}>Delete</button>
                    <button className="saveButton" onClick={injectFrog}>{frog.is_laying_eggs ? "Move" : "Inject"}</button>
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