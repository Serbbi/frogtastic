import useSWR from 'swr';
import UseAllOrganizations from './useAllOrganizations';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useAllNotifications() {
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_URL}/notifications`, fetcher);
    const { organizations } = UseAllOrganizations();
    const userId = localStorage.getItem("userId");

    let names = [];

    if(organizations) {
        organizations.forEach((org) => {
            org.admins.forEach((admin) => {
                if (admin == userId) {
                    names.push(org.name)
                }
            });
        });
    }

    if (!data) return { notifications: [], isLoading: true, error: false };
    const filteredNotifications = data.filter(notification => names.includes(notification.organization_name));

    return {
        notifications: filteredNotifications,
        isLoading,
        error
    };
}