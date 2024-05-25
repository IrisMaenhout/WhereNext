import React, { createContext, useState } from 'react';

// Create the context
export const SelectedPlaceContext = createContext();

// Create a provider component
export const SelectedPlaceProvider = ({ children }) => {
    const [selectedPlaceId, setSelectedPlaceId] = useState(undefined);

    return (
        <SelectedPlaceContext.Provider value={{ selectedPlaceId, setSelectedPlaceId}}>
            {children}
        </SelectedPlaceContext.Provider>
    );
};
