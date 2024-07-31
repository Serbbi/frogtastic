import useSWR from 'swr';

const fetcher = (url, token) => fetch(url, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}).then(res => res.json());

export default function useUser(id) {
    const token = localStorage.getItem('site');
    const { data, error, isLoading, mutate } = useSWR([`http://localhost:8000/users/${id}`, token], ([url, token]) => fetcher(url, token));

    return {
        user: data,
        isLoading,
        error,
        mutate
    };
}