export async function organizationsPostRequest(organization) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organization)
    });

    return await response.json();
}