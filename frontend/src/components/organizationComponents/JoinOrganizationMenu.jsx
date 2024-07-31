import useAllOrganizations from '../../hooks/useAllOrganizations';
import './JoinOrganizationMenu.css';

export default function JoinOrganizationMenu() {
    const token = localStorage.getItem('site');
    const { organizations, isLoading } = useAllOrganizations();
    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    async function putRequest(organizationName) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/Join Request/${organizationName}/`, {
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
        <div className='joinOrganizationMenu'>
            <h1>Join Organization</h1>
            <table className='organizationTable'>
                <tbody>
                    {organizations && organizations.map((organization, index) => (
                        <tr key={organization.name} className={index % 2 === 0 ? 'even' : 'odd'} onClick={(event) => handleJoin(event, organization.name)}>
                            <td className='logoColumn'><img src='/Designer.jpeg' alt='Logo' className='organizationLogo'/></td>
                            <td className='nameColumn'>{organization.name}</td>
                            <td className='descriptionColumn'>{description.length > 100 ? `${description.slice(0, 100)}...` : description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <ul className='organizationsList'>
                {organizations && organizations.map((organization, index) => (
                    <li key={organization.name} onClick={(event) => handleJoin(event, organization.name)}>{organization.name}</li>
                ))}
            </ul> */}
        </div>
    )
}
