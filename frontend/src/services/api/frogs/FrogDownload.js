export async function frogDownloadRequest(organizationId, tankId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/frogs/download-csv?org_q=${organizationId}`;
    if (tankId) {
        url += `&tank_q=${tankId}`;
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
}