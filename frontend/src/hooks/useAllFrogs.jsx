import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllFrogs(organizationId) {
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_URL}/frogs/organization/${organizationId}`, fetcher);

    return {
        frogs: data,
        isLoading,
        error
    };
}