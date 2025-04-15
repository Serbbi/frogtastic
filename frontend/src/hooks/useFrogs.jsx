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

export default function useFrogs(id = null, organizationId = null, currentTankId = null, nOfFrogs = null) {
    const token = localStorage.getItem('site');
    let url = `${process.env.REACT_APP_BACKEND_URL}/frogs`;
    if (id) {
        url += `/${id}`;
    } else {
        let params = new URLSearchParams();
        if (organizationId) {
            params.append('org_q', organizationId);
        }
        if (currentTankId) {
            params.append('tank_q', currentTankId);
        }
        if (nOfFrogs) {
            params.append('no_frogs_q', nOfFrogs);
        }
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
    }
    const { data, error, isLoading, mutate } = useSWR([url, token], ([url, token]) => fetchWithToken(url, token), { revalidateOnFocus: false });

    if (Array.isArray(data)) {
        return {
            frogs: data,
            isLoading,
            error,
            mutate
        };
    }

    return {
        frog: data,
        isLoading,
        error,
        mutate
    };
}