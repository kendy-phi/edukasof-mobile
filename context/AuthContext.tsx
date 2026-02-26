// context/AuthContext.tsx

import { createServices } from '@/api/services';
import { ENV } from '@/config/env';
import { useTenant } from '@/context/TenantContext';
import {
    clearAllAuthStorage,
    getToken,
    saveTokens,
} from '@/utils/secureStorage';
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    services: ReturnType<typeof createServices> | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name:string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { tenant, loading: tenantLoading } = useTenant();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    // 🔥 Determine correct backend per school
    const baseURL = useMemo(() => {
        if (tenant?.type === "full" && tenant.baseURL) {
            return tenant.baseURL;
        }
        return ENV.NEST_API;
    }, [tenant]);

    // 🔥 Create tenant-aware services
    const services = useMemo(() => {
        if (!baseURL) return null;
        return createServices(baseURL);
    }, [baseURL]);

    // 🔄 Initialize Auth
    useEffect(() => {
        const initializeAuth = async () => {
            if (tenantLoading || !services) return;           

            try {
                const token = await getToken();
                if (!token) {
                    setUser(null);
                    return;
                }

                const userData = await services.auth.getProfile();
                console.log("User data ==> ", userData);
                setUser(userData.data ?? userData);
            } catch (error) {
                console.log("User data ==> ", error);
                await clearAllAuthStorage();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [services, tenantLoading]);

    // 🔐 LOGIN
    const login = async (email: string, password: string) => {
        if (!services) return;

        const data = await services.auth.login({email, password});

        await saveTokens(data.accessToken, data.refreshToken);
        setUser(data.user ?? data);
    };

    // 🔐 REGISTER
    const register = async (name:string, email: string, password: string) => {
        if (!services) return;

        const data = await services.auth.register({name, email, password});

        await saveTokens(data.accessToken, data.refreshToken);
        setUser(data.user ?? data);
    };

    // 🚪 LOGOUT
    const logout = async () => {
        await clearAllAuthStorage();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                services,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};