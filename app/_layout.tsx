import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <TenantProvider>
            <AuthProvider>
                <ThemeProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </ThemeProvider>

            </AuthProvider>
        </TenantProvider>
    )
};