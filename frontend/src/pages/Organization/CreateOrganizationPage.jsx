import { useNotification } from '../../services/providers/NotificationProvider';
import { organizationsPostRequest } from '../../services/api/organizations/OrganizationPost';
import './CreateOrganizationPage.css';

export default function CreateOrganizationPage() {
    const { addNotification } = useNotification();

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const organization = {
            name: form[0].value,
            participants: [],
            admins: [],
            table_columns: [],
            system_parameters: {},
            system_parameter_names: []
            // description: form[1].value,
            // image: form[2].files[0]
        };

        organizationsPostRequest(organization)
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