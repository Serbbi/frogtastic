import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useOrganization({ id }) {
    const { data, error, isLoading } = useSWR(id ? `http://localhost:8000/organizations/${id}` : null, fetcher);

    return {
        organization: data,
        isLoading,
        error
    };
}