export async function notificationsPostRequest(notification) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification)
    });

    return await response.json();
}

export async function notificationHandleRequest(notificationId, action) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/${notificationId}/handle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('site')}`
        },
        body: JSON.stringify({ action: action })
    });

    return await response.json();
}