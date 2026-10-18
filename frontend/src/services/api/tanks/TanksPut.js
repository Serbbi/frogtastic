export async function tanksPutRequest(tank, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks/${tank.id}?org_q=${organizationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(tank)
    });

    if (!response.ok) {
        throw new Error('Failed to update tank');
    }

    return await response.json();
}