export async function tanksPutRequest(tank) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks/${tank.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tank)
    });

    return await response.json();
}