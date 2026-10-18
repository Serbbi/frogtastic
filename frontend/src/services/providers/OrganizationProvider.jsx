import { createContext, useState, useContext } from 'react';

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
    const [organization, setOrganization] = useState(null);
    const token = sessionStorage.getItem('token');

    async function fetchAndSetOrganization(id) {
        if (!id) {
            return;
        }
        sessionStorage.setItem("selectedOrg", id);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/organizations/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setOrganization(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization: fetchAndSetOrganization, modifyOrganization: setOrganization }}>
            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganization = () => useContext(OrganizationContext);
