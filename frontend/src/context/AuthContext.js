import React, { createContext, useState, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
    const [isAnonymous, setIsAnonymous] = useState(false);
    // Add theme state, reading from localStorage to persist the setting
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleAnonymousMode = () => {
        setIsAnonymous(prevMode => !prevMode);
    };

    // Add theme toggle function
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    // Effect to update localStorage and the class on the <body> element
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
    }, [theme]);

    // The value that will be available to all consumer components
    const contextValue = {
        isAnonymous,
        toggleAnonymousMode,
        theme,
        toggleTheme,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };