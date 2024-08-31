import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useOrganizations() {
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_URL}/organizations`, fetcher);

    return {
        organizations: data,
        isLoading,
        error
    };
}