export async function frogDeleteRequest(frogId, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/${frogId}?org_q=${organizationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('site')}`
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