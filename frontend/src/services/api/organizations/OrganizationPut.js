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

export async function organizationPutLogo(organizationId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organizationId}/logo`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        },
        body: formData
    })

    return response.json();
}