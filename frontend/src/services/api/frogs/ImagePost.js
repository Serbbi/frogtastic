export async function imagePostRequest(formData, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/${organizationId}`, {
        method: 'POST',
        body: formData,
    });
    
    return await response.json();
}