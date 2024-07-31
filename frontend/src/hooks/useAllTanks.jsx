import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllTanks(organizationId) {
    const { data, error, isLoading } = useSWR(`http://localhost:8000/tanks/organization/${organizationId}`, fetcher);

    return {
        tanks: data,
        isLoading,
        error
    };
}