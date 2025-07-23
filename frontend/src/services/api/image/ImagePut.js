export async function imagePutRequest(decision, frogId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/save?decision=${decision}&frog_id=${frogId}`, {
        method: 'PUT'
    });

    return await response.json();
}