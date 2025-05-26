export async function usersPostRequest(userData) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userData.username,
            hashed_password: userData.password,
            email: userData.email,
            attributes: {},
            organizations: []
        }),
    });

    return response;
}