import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useSystemParameters(organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/system-parameters`;
    if (organizationId) {
        url += `?org_id=${organizationId}`;
    }

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        systemParameters: data,
        isLoading,
        error,
        setSystemParameters: mutate
    };
}