export async function tanksDeleteRequest(tankId, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks/${tankId}?org_q=${organizationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete tank');
    }

    return await response.json();
}