import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        navbarBg: 'bg-white',
        navbarText: 'text-gray-700',
        navbarBorder: 'border-gray-200',
        buttonBg: 'bg-primary-600',
        buttonHover: 'hover:bg-primary-700',
        buttonText: 'text-white',
    });

    const updateTheme = (newTheme) => {
        setTheme((prev) => ({ ...prev, ...newTheme }));
    };

    const resetTheme = () => {
        setTheme({
            navbarBg: 'bg-white',
            navbarText: 'text-gray-700',
            navbarBorder: 'border-gray-200',
            buttonBg: 'bg-primary-600',
            buttonHover: 'hover:bg-primary-700',
            buttonText: 'text-white',
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
