export async function organizationPutRequest(organization) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organization.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
    })

    return response.json();
}