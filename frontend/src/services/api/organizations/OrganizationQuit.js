export async function organizationQuitRequest(organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organizationId}/quit`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to quit organization');
    }

    return await response.json();
}