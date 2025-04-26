import { createContext, useState, useContext } from 'react';

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    return (
        <UnsavedChangesContext.Provider value={{ unsavedChanges, setUnsavedChanges }}>
            {children}
        </UnsavedChangesContext.Provider>
    );
}

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);