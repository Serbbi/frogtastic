export async function usersPutRequest(user, organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
}

export async function usersPutProfilePicRequest(file, userId) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/profile-pic`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
    });

    return response.json();
}