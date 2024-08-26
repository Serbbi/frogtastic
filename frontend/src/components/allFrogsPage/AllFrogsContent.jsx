import FrogTable from "../miniComponents/FrogTable";
import Loading from "../miniComponents/loading";
import useFrogs from "../../hooks/useFrogs";
import { useOrganization } from "../../hooks/OrganizationProvider"
import './AllFrogsContent.css';

export default function AllFrogsContent() {
    const { organization } = useOrganization();
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, null, null);

    if (isLoading) return (<div className="allFrogsContainer"><Loading /></div>);

    return (
        <div className="allFrogsContainer">
            <h1 className="title">All Frogs</h1>
            {frogs.length === 0 && <h2>No Frogs</h2>}
            {frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization}/>}
        </div>
    );
}