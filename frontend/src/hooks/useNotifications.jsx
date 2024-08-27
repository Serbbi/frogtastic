import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useNotifications(organizationId) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/notifications`;
    if (organizationId) {
        url += `?org_q=${organizationId}`;
    }


    const { data, error, isLoading } = useSWR(url, fetcher);

    return {
        notifications: data,
        isLoading,
        error
    };
}