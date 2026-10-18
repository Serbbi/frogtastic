export async function systemParametersPutRequest(updatedRows, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/system-parameters?org_q=${organizationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRows)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update parameters!");
    }

    return response.json();
}

export async function systemParametersUpdateListValuesRequest(updatedRows, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/system-parameters/update-values?org_q=${organizationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRows)
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update parameters!");
    }

    return response.json();
}