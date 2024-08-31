import useSWR from 'swr';

const fetchWithToken = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return await res.json();
};

export default function useUsers(organizationId) {
    const token = localStorage.getItem('site');
    let url = `${process.env.REACT_APP_BACKEND_URL}/users`;
    
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }

    const { data, error, isLoading, mutate } = useSWR([url, token], ([url, token]) => fetchWithToken(url, token));

    return {
        users: data,
        isLoading,
        error,
        mutate
    };
}
