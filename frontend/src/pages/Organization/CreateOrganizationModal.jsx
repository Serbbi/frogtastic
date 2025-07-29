import { organizationsPostRequest } from '../../services/api/organizations/OrganizationPost';
import { useNotification } from '../../services/providers/NotificationProvider';
import { useState } from 'react';

export default function CreateOrganizationModal({ show, onClose }) {
    const { addNotification } = useNotification();
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const organization = {
            name: form.orgName.value,
            participants: [],
            admins: [],
            table_columns: [],
            system_parameters: {},
            system_parameter_names: []
        };
        organizationsPostRequest(organization)
            .then(data => {
                if (data.error) throw new Error(data.error);
                addNotification({ text: "Organization created", type: "success" });
            })
            .catch(error => {
                addNotification({ text: error.message, type: "error" });
            });
        onClose();
    }

    function validateInput(event) {
        setErrorMessage("");
        const input = event.target;
        if (input.value.length > 50) {
            setErrorMessage("Organization name must be less than 50 characters.");
        }
    }

    return (
        show && (
            <div className='modalJoinOrg'>
                <div className='modalContentJoinOrg'>
                    <span className='closeJoinOrg' onClick={() => onClose()}>&times;</span>
                    <h1>Create Organization</h1>
                    <form onSubmit={handleSubmit} className="createOrgForm">
                        <div className='formGroup'>
                            <label htmlFor="orgName">Organization Name:</label>
                            <input type="text" id="orgName" name="orgName" required onBlur={(e) => validateInput(e)} />
                        </div>
                        <p className="errorText">{errorMessage}</p>
                        <button type="submit" className='primary-button' disabled={errorMessage !== ""}>Create</button>
                    </form>
                </div>
            </div>
        )
    );
}