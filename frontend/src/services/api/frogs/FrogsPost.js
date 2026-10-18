export async function frogsPostRequest(organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/instantiate-frogs?org_q=${organizationId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to instantiate frogs!");
    }
    return await response.json();
}