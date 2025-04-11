export default function FrogTableLoading({ organization }) {
    function formatColumnName(columnName) {
        return columnName.split('_').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ');
    }

    return (
        <table className='frogTable'>
            <thead className='tableHead'>
                <tr>
                    {organization && Object.hasOwn(organization, "table_columns") && organization.table_columns.map(column => {
                        if (column === "current_tank") return <th key={column}>Tank</th>;
                        return <th key={column}>{formatColumnName(column)}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {[...Array(5)].map((_, index) => (
                    <tr key={index} className='tableRow'>
                        {organization && Object.hasOwn(organization, "table_columns") && organization.table_columns.map(column => (
                            <td key={column} className="te"><span className="rectangleLoader"></span></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}