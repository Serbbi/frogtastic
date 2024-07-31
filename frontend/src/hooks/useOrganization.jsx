import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useOrganization({ id }) {
    const { data, error, isLoading } = useSWR(id ? `${process.env.REACT_APP_BACKEND_URL}/organizations/${id}` : null, fetcher);

    return {
        organization: data,
        isLoading,
        error
    };
}