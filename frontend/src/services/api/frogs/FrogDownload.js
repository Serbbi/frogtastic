export async function frogDownloadRequest(organizationId, tankId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/download-csv?org_q=${organizationId}&tank_q=${tankId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
}