import { useState, useEffect } from "react";
import FrogTable from "../miniComponents/FrogTable";
import FrogDetailsContent from "../miniComponents/frogDetailsContent";
import Loading from "../miniComponents/loading";

export default function AllFrogsContent() {
    const [frogs, setFrogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showingFrog, setShowingFrog] = useState(null);

    useEffect(() => {
        async function fetchAllFrogs() {
            fetch("http://localhost:8000/frogs")
            .then(response => response.json())
            .then(data => {
                setFrogs(data);
                console.log(data);
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false));
        }
        fetchAllFrogs();
    }, []);

    function goBackAction() {
        setShowingFrog(null);
    }

    if (isLoading) return (<div className="allFrogsContainer"><Loading /></div>);

    if (showingFrog) return (<div className='intermediateContainer'><FrogDetailsContent frog={showingFrog} goBackAction={goBackAction} /></div>);

    return (
        <div className="allFrogsContainer">
            <h1>All Frogs</h1>
            {frogs.length !== 0 && <FrogTable frogs={frogs} setShowingFrog={setShowingFrog} />}
        </div>
    );
}