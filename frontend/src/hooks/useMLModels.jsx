import useSWR from 'swr';

const fetchWithToken = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        if (errorData.detail && Array.isArray(errorData.detail)) {
            throw new Error(errorData.detail[0].msg || res.statusText);
        }

        throw new Error(errorData.detail || res.statusText);
    }
    return await res.json();
};

export default function useMLModels(organizationId = null) {
    const token = sessionStorage.getItem('token');
    let url = `${process.env.REACT_APP_BACKEND_URL}/ml-models/names`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }

    const { data, error, isLoading } = useSWR([url, token], ([url, token]) => fetchWithToken(url, token), { revalidateOnFocus: false });

    return {
        mlModels: data,
        isLoading,
        error
    };
}