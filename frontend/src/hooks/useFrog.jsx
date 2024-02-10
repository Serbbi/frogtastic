import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllFrogs({ id }) {
    const { data, error, isLoading } = useSWR(id ? `http://localhost:8000/frogs/${id}` : null, fetcher);

    return {
        frog: data,
        isLoading,
        error
    };
}