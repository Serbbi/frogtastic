import useSWR from 'swr';

// const fetcher = (...args) => fetch(...args).then(res => res.json());

const fetchWithToken = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status === 401) {
        throw new Error('Token has expired');
    }
    return await res.json();
};

export default function useOrganizations() {
    const token = localStorage.getItem('site');
    // const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_URL}/organizations`, fetcher);
    const { data, error, isLoading } = useSWR([`${process.env.REACT_APP_BACKEND_URL}/organizations`, token], ([url, token]) => fetchWithToken(url, token));

    return {
        organizations: data,
        isLoading,
        error
    };
}