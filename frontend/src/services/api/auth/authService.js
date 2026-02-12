const MAX_RETRIES = 5;

async function retryRequest(fn, maxRetries = MAX_RETRIES) {
    let attempt = 1;

    while (attempt <= maxRetries) {
        try {
            return await fn();
        } catch (err) {
            if (err.message.includes("Incorrect")) throw Error("Incorrect username or password");
            if (attempt === maxRetries) throw err;

            const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
            await new Promise(res => setTimeout(res, delay));
            attempt++;
        }
    }
}

export async function login({ username, password }) {
    return retryRequest(async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `username=${username}&password=${password}`,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Login failed");
        }
        return await response.json();
    });
}

export async function signUp({ username, password, email }) {
    return retryRequest(async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                hashed_password: password,
                email,
                attributes: {},
                organizations: [],
            }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Signup failed");
        }
        return await response.json();
    });
}

export async function validateToken(token) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/validate-token`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Invalid token");
    return await response.json();
}

export async function googleLogin(token) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/token/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Google login failed");
    }
    return await response.json();
}

export async function getMe(token) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await response.json();
}
