import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from "@/theme";

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
    theme: typeof lightTheme;
    mode: ThemeType;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children}: any ) =>{
    
    const [mode, setMode] = useState<ThemeType>('light');
    
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () =>{
        const saved =  await AsyncStorage.getItem('theme');
        if(saved == 'dark') setMode('dark');
    }

    const toggleTheme = async () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        await AsyncStorage.setItem('theme', newMode);
    }

    const theme = mode == 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () =>{

    const context = useContext(ThemeContext);
    if(!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context
}