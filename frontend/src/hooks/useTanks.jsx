import useSWR from 'swr';

const customFetch = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        if (errorData.detail && Array.isArray(errorData.detail)) {
            throw new Error(errorData.detail[0].msg || res.statusText);
        }

        throw new Error(errorData.detail || res.statusText);
    }
    return await res.json();
};

export default function useTanks(organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/tanks`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }
    const { data, error, isLoading, mutate } = useSWR(url, customFetch, { revalidateOnFocus: false });

    if (!data) {
        return {
            tanks: [],
            isLoading,
            error,
            mutate
        };
    }

    return {
        tanks: data,
        isLoading,
        error,
        mutate
    };
}