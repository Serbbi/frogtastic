import { useState } from "react";
import FrogTable from "../miniComponents/FrogTable";
import FrogDetailsContent from "../miniComponents/frogDetailsContent";
import Loading from "../miniComponents/loading";
import useAllFrogs from "../../hooks/useAllFrogs";
import './AllFrogsContent.css';

export default function AllFrogsContent() {
    const [showingFrog, setShowingFrog] = useState(null);
    const { frogs, isLoading } = useAllFrogs();

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