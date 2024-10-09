import React, { useContext, useState } from 'react';

const ThemeContext = React.createContext()
const UpdateThemeContext = React.createContext()

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const useUpdateTheme = () => {
    return useContext(UpdateThemeContext);
}

export const ThemeProvider = ({ children }) => {
    const [themeValues, setThemeValues] = useState({
        PageColor: "#23272A",
        USDColor: "#85BB65",
        TextColor: "#FFFFFF",
        AccentColor: "#2D2F33",
        PagePadding: 35,
        TopPadding: 70,
        BorderRadius: 15,
    });

    const changeTheme = (newTheme) => {
        setThemeValues((prevTheme) => { return { ...prevTheme, ...newTheme } })
    }

    return (
        <ThemeContext.Provider value={themeValues}>
            <UpdateThemeContext.Provider value={changeTheme}>
                {children}
            </UpdateThemeContext.Provider>
        </ThemeContext.Provider>

    )
}