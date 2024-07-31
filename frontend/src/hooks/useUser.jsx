import useSWR from 'swr';

const fetcher = (url, token) => fetch(url, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}).then(res => res.json());

export default function useUser(id) {
    const token = localStorage.getItem('site');
    const { data, error, isLoading, mutate } = useSWR([`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, token], ([url, token]) => fetcher(url, token));

    return {
        user: data,
        isLoading,
        error,
        mutate
    };
}