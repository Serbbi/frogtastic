export async function usersPutRequest(user, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}?org_q=${organizationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
}