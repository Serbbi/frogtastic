import { useNotification } from '../../hooks/NotificationProvider';
import { v4 as uuidv4 } from 'uuid';
import './CreateOrganizationMenu.css';

export default function CreateOrganizationMenu() {
    const token = localStorage.getItem('site');
    const { addNotification } = useNotification();

    async function postRequest(organization) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(organization)
        });

        return await response.json();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const organization = {
            name: form[0].value,
            participants: [],
            admins: [],
            table_columns: [],
            system_parameters: {},
            // description: form[1].value,
            // image: form[2].files[0]
        };

        postRequest(organization)
            .then(data => {
                if (data.error) throw new Error(data.error);
                console.log(data);
                addNotification({ text: "Organization created", type: "success" });
            })
            .catch(error => {
                console.error(error);
                addNotification({ text: error.message, type: "error" });
            });
    }

    return (
        <div className='createOrganizationMenu'>
            <h1 className='title'>Create Organization</h1>
            <form className='createOrganizationForm' onSubmit={handleSubmit}>
                <div className="contentWithoutButton">
                    <div className="nameAndDescription">
                        <input type="text" placeholder="Organization Name" />
                        <textarea type="text" placeholder="Organization Description" />
                    </div>
                    <input type="file" />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}