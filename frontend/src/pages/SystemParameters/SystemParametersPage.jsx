import './SystemParametersPage.css';
import SystemParametersTable from '../../components/miniComponents/SystemParametersTable';

export default function SystemParametersPage({ organization }) {


    return (
        <div className="systemParamsContainer">
            <h1 className='title'>System Parameters</h1>
            <SystemParametersTable />
        </div>
    );
}