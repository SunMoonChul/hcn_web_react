import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

const initialState = {
    loginState: false,
    loginUser: null,
    accountSummaries: [],
    // other initial state properties
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem('appData');
        return storedData ? JSON.parse(storedData) : initialState;
    });

    useEffect(() => {
        localStorage.setItem('appData', JSON.stringify(data));
    }, [data]);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};
