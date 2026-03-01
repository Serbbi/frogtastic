export async function imagePostRequest(formData, organizationId, modelName) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/${organizationId}?model_name=${modelName}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload image");
    }
    return await response.json();
}

export async function imagePostBulkUploadReferences(formData, organizationId) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image/bulk-upload-reference?org_q=${organizationId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload reference images");
    }
    return await response.json();
}