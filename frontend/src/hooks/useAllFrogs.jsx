import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllFrogs(organizationId) {
    const { data, error, isLoading } = useSWR(`http://localhost:8000/frogs/organization/${organizationId}`, fetcher);

    return {
        frogs: data,
        isLoading,
        error
    };
}