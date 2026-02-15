import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from "expo-router";

export default function RootLayout() {
    return (<AuthProvider>
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </ThemeProvider>

    </AuthProvider>
    )
};