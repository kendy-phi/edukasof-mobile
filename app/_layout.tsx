import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from '@/context/ThemeContext';
import { LeagueProvider } from '@/context/LeagueContext';
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <TenantProvider>
            <AuthProvider>
                <ThemeProvider>
                    <LeagueProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                    </LeagueProvider>
                </ThemeProvider>

            </AuthProvider>
        </TenantProvider>
    )
};