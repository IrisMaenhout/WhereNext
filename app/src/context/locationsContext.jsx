import React, { createContext, useState } from 'react';

// Create the context
export const PlacesContext = createContext();

// Create a provider component
export const PlacesProvider = ({ children }) => {
    const [places, setPlaces] = useState([]);
    const [error, setError] = useState(null);

    return (
        <PlacesContext.Provider value={{ places, setPlaces, error, setError }}>
            {children}
        </PlacesContext.Provider>
    );
};
