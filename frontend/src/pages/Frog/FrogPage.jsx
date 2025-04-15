import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../services/providers/NotificationProvider";
import useTanks from "../../hooks/useTanks";
import HistoryTable from "../../components/miniComponents/HistoryTable";
import useFrogs from "../../hooks/useFrogs";
import Loading from "../../components/miniComponents/loading";
import { useNavigate, useParams } from "react-router-dom";
import { useImage } from "../../services/providers/ImageProvider";
import ConfirmationBox from "../../components/miniComponents/ConfirmationBox";
import { useUnsavedChanges } from "../../services/providers/UnsavedChangesProvider";
import { frogPutRequest } from "../../services/api/frogs/FrogPut";
import { frogDeleteRequest } from "../../services/api/frogs/FrogDelete";
import "./FrogPage.css";

export default function FrogPage({ organization }) {
    const { addNotification } = useNotification();
    const { tanks } = useTanks(organization ? organization.id : -1);
    const [showHistory, setShowHistory] = useState(false);
    const privileges = JSON.parse(localStorage.getItem('privileges'));
    const [canEditFrogs, setCanEditFrogs] = useState(false);
    const { frogId } = useParams();
    const { frog, isLoading, mutate: mutateFrog } = useFrogs(frogId, null, null, null);
    const navigate = useNavigate();
    const { extractionImageURL } = useImage();
    const [showCompareModal, setShowCompareModal] = useState(window.history.state.usr === "from upload" ? true : false);
    const [confirmationBoxText, setconfirmationBoxText] = useState("");
    const { unsavedChanges, setUnsavedChanges } = useUnsavedChanges();

    useEffect(() => {
        if (organization) {
            setCanEditFrogs(privileges[organization.id]['canEditFrogs']);
        }
    }, [organization]);

    async function updateField(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        setUnsavedChanges(true);
        if (name === "current_tank_id") {
            await mutateFrog(prevFrog => ({ ...prevFrog, current_tank_id: Number(value) }), false);
            return;
        }

        await mutateFrog(prevFrog => ({ ...prevFrog, attributes: { ...prevFrog.attributes, [name]: value } }), false);
    }

    function saveFrog() {
        frogPutRequest(frog, organization.id)
            .then(_ => {
                addNotification({ text: "Frog saved", type: "success" });
                setUnsavedChanges(false);
            })
            .catch((error) => {
                addNotification({ text: error.message, type: "error" });
            });
    }

    function deleteFrog() {
        const confirmation = window.confirm("Are you sure you want to delete this frog?");
        if (!confirmation) return;

        frogDeleteRequest(frog.id, organization.id)
            .then(_ => {
                addNotification({ text: "Frog deleted", type: "trash" });
                setUnsavedChanges(false);
                navigate(-1);
            })
            .catch((error) => {
                addNotification({ text: error.message, type: "error" });
            });
    }

    function checkForChanges() {
        if (unsavedChanges) {
            setconfirmationBoxText("You have unsaved changes, are you sure you want to leave?");
        } else {
            navigate(-1);
        }
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
        return <HistoryTable id={frog.id} setShowHistory={setShowHistory} showHistory={showHistory} tanks={tanks} />
    }

    return (
        <div className="frogDetailsContainer">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" onClick={checkForChanges} className="goBackButton" />
            <h1>Frog-{frog.frog_number} Tank-{frog.tank_id}
                {frog && !frog.attributes.is_sick ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                    : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
            </h1>
            <div className="leftRightContainer">
                <div className="leftDetailsContainer">
                    {frog && Object.entries(frog.attributes).map(([key, value]) => {
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
                        <select name="current_tank_id" disabled={!canEditFrogs} onChange={updateField} value={frog.current_tank_id ? frog.current_tank_id : -1}>
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
                    <div>
                        <h2>Extraction Image</h2>
                        <img src={`data:image/png;base64,${extractionImageURL}`} alt="Extraction" />
                    </div>
                    <div>
                        <h2>Reference Image</h2>
                        <img src={frog.image_path} alt="Reference" />
                    </div>
                </div>
            </div>}
            {confirmationBoxText && <ConfirmationBox message={confirmationBoxText} onConfirm={() => { navigate(-1); setUnsavedChanges(false); }} onCancel={() => setconfirmationBoxText("")} />}
        </div>
    );
}