import { createContext, useState, useContext } from 'react';

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
    const [organization, setOrganization] = useState(null);

    async function fetchAndSetOrganization(id) {
        try {
            const response = await fetch(`http://localhost:8000/organizations/${id}`);
            const data = await response.json();
            setOrganization(data);
        }
        catch (error) {
            console.error(error);
        }
        
    }

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization: fetchAndSetOrganization }}>
            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganization = () => useContext(OrganizationContext);
