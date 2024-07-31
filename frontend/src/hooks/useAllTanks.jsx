import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllTanks(organizationId) {
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_URL}/tanks/organization/${organizationId}`, fetcher);

    return {
        tanks: data,
        isLoading,
        error
    };
}