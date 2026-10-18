export async function frogDeleteRequest(frogId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/${frogId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (errorData.detail && Array.isArray(errorData.detail)) {
            throw new Error(errorData.detail[0].msg || response.statusText);
        }

        throw new Error(errorData.detail || response.statusText);
    }

    return await response.json();
}