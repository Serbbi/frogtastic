export async function tanksPostRequest(tank) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tanks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tank)
    });

    return await response.json();
}