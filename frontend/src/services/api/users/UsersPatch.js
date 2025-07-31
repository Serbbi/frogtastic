export async function usersPatchRequest(user) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
}