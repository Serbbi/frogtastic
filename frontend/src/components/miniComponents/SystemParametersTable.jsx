import './SystemParametersTable.css';

export default function SystemParametersTable() {
    function handleAddParam() {
        console.log('Add param');
    }

    function handleAddRow() {
        console.log('Add row');
    }

    return (
        <div>
            <table className='paramsTable'>
                <thead className='tableHead'>
                    <tr>
                        <th>Date</th>
                        <th>Water Salinity</th>
                        <th>Water Temperature</th>
                        <th>Water pH</th>
                        <th>Water Ammonia</th>
                        <th><button className='addParamButton' onClick={handleAddParam}>+</button></th>
                    </tr>
                </thead>
                <tbody> 
                    <tr className='tableRow'>
                        <td>2021-09-01</td>
                        <td>0.5 ppt</td>
                        <td>20°C</td>
                        <td>7.5</td>
                        <td>0.1 ppm</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleAddRow}>Add Row</button>
        </div>
    );
}