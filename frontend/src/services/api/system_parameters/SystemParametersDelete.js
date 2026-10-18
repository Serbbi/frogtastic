export async function systemParametersDeleteRequest(ids, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/system-parameters/bulk?org_q=${organizationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(ids)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete rows!");
    }
    return response.json();
}