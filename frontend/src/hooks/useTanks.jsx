import { useDebugValue } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useTanks(organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/tanks`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }
    const { data, error, isLoading } = useSWR(url, fetcher);

    useDebugValue(data);

    return {
        tanks: data,
        isLoading,
        error
    };
}