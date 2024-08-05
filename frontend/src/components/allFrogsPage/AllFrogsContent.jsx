import FrogTable from "../miniComponents/FrogTable";
import Loading from "../miniComponents/loading";
import useAllFrogs from "../../hooks/useAllFrogs";
import { useOrganization } from "../../hooks/OrganizationProvider"
import './AllFrogsContent.css';

export default function AllFrogsContent() {
    const { organization } = useOrganization();
    const { frogs, isLoading } = useAllFrogs(organization ? organization.id : -1);

    if (isLoading) return (<div className="allFrogsContainer"><Loading /></div>);

    return (
        <div className="allFrogsContainer">
            <h1>All Frogs</h1>
            {frogs.length === 0 && <h2>No Frogs</h2>}
            {frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization}/>}
        </div>
    );
}