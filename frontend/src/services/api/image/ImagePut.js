export async function imagePutRequest(decision, frogId, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/save?decision=${decision}&frog_id=${frogId}&organization_id=${organizationId}`, {
        method: 'PUT'
    });

    return await response.json();
}