export async function frogsPutRequest(attributes, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs?org_q=${organizationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        },
        body: JSON.stringify(attributes)
    });

    return await response.json();
}