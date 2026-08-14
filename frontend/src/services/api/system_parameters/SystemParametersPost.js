export async function systemParametersPostRequest(organizationId, parameters) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/system-parameters?org_q=${organizationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(parameters)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create row!");
    }

    return response.json();
}