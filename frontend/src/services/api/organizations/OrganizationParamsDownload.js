export async function paramDownloadRequest(organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${organizationId}/download-csv`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
}