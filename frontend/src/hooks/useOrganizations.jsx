import useSWR from 'swr';

const fetchWithToken = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        throw new Error(errorData.detail || res.statusText);
    }

    return await res.json();
};

export default function useOrganizations() {
    const token = localStorage.getItem('site');
    const { data, error, isLoading, mutate } = useSWR([`${process.env.REACT_APP_BACKEND_URL}/organizations`, token], ([url, token]) => fetchWithToken(url, token));

    return {
        organizations: data,
        isLoading,
        error,
        mutate
    };
}