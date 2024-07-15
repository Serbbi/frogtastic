import useAllOrganizations from '../../hooks/useAllOrganizations';

export default function JoinOrganizationMenu() {
    const token = localStorage.getItem('site');
    const { organizations, isLoading } = useAllOrganizations();

    async function putRequest(organizationName) {
        const response = await fetch(`http://localhost:8000/notifications/Join Request/${organizationName}/`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST'
        });

        return await response.json();
    }

    function handleJoin(event, organizationName) {
        event.preventDefault();

        putRequest(organizationName)
            .then(data => {
                if (data.error) throw new Error(data.error);
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
            <h1>Join Organization</h1>
            <ul>
                {organizations && organizations.map((organization, index) => (
                    <li key={organization.name} onClick={(event) => handleJoin(event, organization.name)}>{organization.name}</li>
                ))}
            </ul>
        </div>
    )
}
