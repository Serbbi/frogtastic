export async function tanksPostRequest(tank, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks?org_q=${organizationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(tank)
    });

    if (!response.ok) {
        throw new Error('Failed to add tank');
    }

    return await response.json();
}