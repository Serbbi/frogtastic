export async function tokenPostRequest(userData) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${userData.username}&password=${userData.password}`,
    });

    return response;
}