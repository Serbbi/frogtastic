import useSWR from 'swr';

const fetcher = (url, token) => fetch(url, {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}).then(res => res.json());

export default function useAllUsers() {
    const token = localStorage.getItem('site');
    const { data, error, isLoading } = useSWR([`${process.env.REACT_APP_BACKEND_URL}/users/`, token], ([url, token]) => fetcher(url, token));

    return {
        users: data,
        isLoading,
        error
    };
}