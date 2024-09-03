export async function tanksDeleteRequest(tankId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks/${tankId}`, {
        method: 'DELETE'
    });

    return await response.json();
}