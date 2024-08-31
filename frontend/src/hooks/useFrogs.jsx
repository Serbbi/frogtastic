import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useFrogs(id = null, organizationId = null, currentTankId = null, nOfFrogs = null) {
    let url = `${process.env.REACT_APP_BACKEND_URL}/frogs`;
    if (id) {
        url += `/${id}`;
    } else {
        let params = new URLSearchParams();
        if (organizationId) {
            params.append('org_q', organizationId);
        }
        if (currentTankId) {
            params.append('tank_q', currentTankId);
        }
        if (nOfFrogs) {
            params.append('no_frogs_q', nOfFrogs);
        }
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
    }
    const { data, error, isLoading } = useSWR(url, fetcher);

    if (Array.isArray(data)) {
        return {
            frogs : data,
            isLoading,
            error
        };
    }

    return {
        frog : data,
        isLoading,
        error
    };
}