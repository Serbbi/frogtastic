import FrogTable from "../../components/miniComponents/FrogTable";
import useFrogs from "../../hooks/useFrogs";
import FrogTableLoading from "../../components/miniComponents/FrogTableLoading";
import './AllFrogsPage.css';

export default function AllFrogsPage({ organization }) {
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, null, null);

    if (isLoading) return (<FrogTableLoading organization={organization} />);

    return (
        <div className="allFrogsContainer">
            <h1 className="title">All Frogs</h1>
            {frogs.length === 0 && <h2>No Frogs</h2>}
            {frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization} />}
        </div>
    );
}