export async function usersPutRequest(user, organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
}