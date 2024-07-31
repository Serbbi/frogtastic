import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useFrog(id) {
    const { data, error, isLoading } = useSWR(id ? `${process.env.REACT_APP_BACKEND_URL}/frogs/${id}` : null, fetcher);

    return {
        frog: data,
        isLoading,
        error
    };
}