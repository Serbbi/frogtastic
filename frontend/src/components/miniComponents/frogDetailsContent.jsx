import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../hooks/NotificationProvider";
import { v4 as uuidv4 } from "uuid";
import { throwIfNotOk } from "../../util/errorThrower";
import useTanks from "../../hooks/useTanks";
import { useOrganization } from "../../hooks/OrganizationProvider";
import HistoryTable from "./HistoryTable";
import useFrogs from "../../hooks/useFrogs";
import Loading from "./loading";
import { useNavigate, useParams } from "react-router-dom";
import { useImage } from "../../hooks/ImageProvider";
import "./frogDetailsContent.css";

export default function FrogDetailsContent() {
    const { addNotification } = useNotification();
    const token = localStorage.getItem('site');
    const [ saved, setSaved ] = useState(true);
    const { organization } = useOrganization();
    const { tanks } = useTanks(organization ? organization.id : -1);
    const [ showHistory, setShowHistory ] = useState(false);
    const privileges = JSON.parse(localStorage.getItem('privileges'));
    const [ canEditFrogs, setCanEditFrogs ] = useState(false);
    const { frogId } = useParams();
    const { frog, isLoading } = useFrogs(frogId, null, null, null);
    const [ changedFrog, setChangedFrog ] = useState(null);
    const navigate = useNavigate();
    const { extractionImageURL } = useImage();
    const [ showCompareModal, setShowCompareModal ] = useState(false);

    useEffect(() => {
        if (organization) {
            setCanEditFrogs(privileges[organization.id]['canEditFrogs']);
        }
    }, [organization]);

    useEffect(() => {
        setChangedFrog(frog);
    }, [frog]);

    function updateField(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        if (name === "current_tank_id") {
            setChangedFrog(prevFrog => ({ ...prevFrog, current_tank_id: Number(value) }));
            setSaved(false);
            return;
        }

        const newAttributes = { ...changedFrog.attributes, [name]: value };
        setChangedFrog(prevFrog => ({ ...prevFrog, attributes: newAttributes }));
        setSaved(false);
    }

    async function updateRequest(frog) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/${frog.id}?org_q=${organization.id}`, {
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
        updateRequest(changedFrog)
            .then(data => {
                setSaved(true);
                addNotification({ id: uuidv4(), text: "Frog saved", type: "success" });
            })
            .catch((error) => {
                addNotification({ id: uuidv4(), text: error.message, type: "error" });
            });
    }

    async function deleteRequest(frog) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/${frog.id}?org_q=${organization.id}`, {
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

        deleteRequest(changedFrog)
            .then(data => {
                addNotification({ id: uuidv4(), text: "Frog deleted", type: "trash" });
                navigate(-1);
            })
            .catch((error) => {
                addNotification({ id: uuidv4(), text: error.message, type: "error" });
            });
    }

    function checkForChanges() {
        if (!saved) {
            const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmLeave) return;
        }
        navigate(-1);
    }

    function formatLabel(label) {
        return label.split('_').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ');
    }

    if (isLoading) return (<div className="allFrogsContainer"><Loading /></div>);

    if (!frog) {
        return <div className="allFrogsContainer"><h1>Frog not found</h1></div>;
    }

    if (frog && organization && frog.organization_id !== organization.id) {
        return <div className="allFrogsContainer"><h1>You cannot see this frog :(</h1></div>;
    }

    if (showHistory) {
        return <HistoryTable id={frog.id} setShowHistory={setShowHistory} showHistory={showHistory} tanks={tanks}/>
    }

    return (
        <div className="frogDetailsContainer">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={checkForChanges} className="goBackButton" />
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}
                {changedFrog && !changedFrog.attributes.is_sick ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                    : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
            </h1>
            <div className="leftRightContainer">
                <div className="leftDetailsContainer">
                    {changedFrog && Object.entries(changedFrog.attributes).map(([key, value]) => {
                        if (key === "notes") 
                            return (
                                <div className="frogField" key={key}>
                                    <label>{formatLabel(key)}</label>
                                    <textarea name={key} value={value} disabled={!canEditFrogs} onChange={updateField} />
                                </div>
                            );
                        if (key === "is_sick") 
                            return (
                                <div className="frogField" key={key}>
                                    <label>{formatLabel(key)}</label>
                                    <input type="checkbox" name={key} checked={value} disabled={!canEditFrogs} onChange={updateField} />
                                </div>
                            );
                        if (key === "last_injection")
                            return (
                                <div className="frogField" key={key}>
                                    <label>{formatLabel(key)}</label>
                                    <input type="date" name={key} value={value} disabled={!canEditFrogs} onChange={updateField} />
                                </div>
                            );
                        return (
                            <div className="frogField" key={key}>
                                <label>{formatLabel(key)}</label>
                                <input type="text" name={key} value={value} disabled={!canEditFrogs} onChange={updateField} />
                            </div>
                        );
                    })}
                    <div className="frogField" key="current_tank_id">
                        <label>Current Tank</label>
                        <select name="current_tank_id" disabled={!canEditFrogs} onChange={updateField}>
                            {!frog.current_tank_id && <option value={-1}></option>}
                            {tanks && tanks.map(tank => (
                                <option key={tank.id} value={tank.id}>{tank.tank_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="rightDetailsContainer">
                    <button className="saveButton" onClick={() => setShowCompareModal(true)}>Compare</button>
                    <button className="saveButton" onClick={saveFrog}>Save</button>
                    <button className="saveButton" onClick={deleteFrog}>Delete</button>
                    <button className="saveButton" onClick={() => setShowHistory(!showHistory)}>History</button>
                </div>
            </div>
            {showCompareModal && <div className="modalCompareImages">
                <div className="modalCompareImagesContent">
                    <span className='closeJoinOrg' onClick={() => setShowCompareModal(false)}>&times;</span>
                    <h2>Extraction Image</h2>
                    <h2>Reference Image</h2>
                    <img src={`data:image/png;base64,${extractionImageURL}`} alt="Extraction" />
                    <img src={frog.image_path} alt="Reference" />
                </div>
            </div>}
            
        </div>
    );
}