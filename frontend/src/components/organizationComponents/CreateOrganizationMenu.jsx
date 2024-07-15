export default function CreateOrganizationMenu() {
    const token = localStorage.getItem('site');

    async function postRequest(organization) {
        const response = await fetch('http://localhost:8000/organizations/', {
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
            // description: form[1].value,
            // image: form[2].files[0]
        };

        postRequest(organization)
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
            <h1>Create Organization</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Organization Name" />
                <input type="text" placeholder="Organization Description" />
                <input type="file" />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}