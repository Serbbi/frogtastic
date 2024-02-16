export function throwIfNotOk(response) {
    if (response.status === 400) throw new Error("Bad request");
    if (response.status === 401) throw new Error("Unauthorized");
    if (response.status === 403) throw new Error("Forbidden");
    if (response.status === 404) throw new Error("Not found");
    if (response.status === 422) throw new Error("Unprocessable entity");
    if (response.status === 500) throw new Error("Internal server error");
}