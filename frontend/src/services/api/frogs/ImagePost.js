export async function imagePostRequest(formData, organizationId, modelId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/${organizationId}?model_id=${modelId}`, {
        method: 'POST',
        body: formData,
    });

    return await response.json();
}