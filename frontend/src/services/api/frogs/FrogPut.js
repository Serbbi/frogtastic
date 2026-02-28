export async function frogPutRequest(frog) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/frogs/${frog.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(frog)
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