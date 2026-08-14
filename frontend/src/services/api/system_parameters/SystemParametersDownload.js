export async function systemParametersDownloadRequest(organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/system-parameters/download-csv?org_id=${organizationId}`, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
}