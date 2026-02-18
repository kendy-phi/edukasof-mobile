import { useTenant } from '@/context/TenantContext';
import {
  clearAllAuthStorage,
  getToken,
  saveToken,
} from '@/utils/secureStorage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive:boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const QUIZ_BASE_URL = "http://192.168.192.6:3250/api/v1";//"https://quiz.edukasof.com";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenant, loading: tenantLoading } = useTenant();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // 🔥 AUTH INITIALIZATION FIXED
  useEffect(() => {
    const initializeAuth = async () => {

      // Wait for tenant to finish loading
      if (tenantLoading) return;

      try {
        const token = await getToken();

        if (!token) {
          setUser(null);
          return;
        }

        // Determine baseURL
        let baseURL = QUIZ_BASE_URL;

        if (tenant?.type === "full" && tenant.baseURL) {
          baseURL = tenant.baseURL;
        }

        const response = await axios.get(
          `${baseURL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.data ?? response.data);

      } catch (error) {
        await clearAllAuthStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

  }, [tenant, tenantLoading]);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    let baseURL = QUIZ_BASE_URL;

    if (tenant?.type === "full" && tenant.baseURL) {
      baseURL = tenant.baseURL;
    }

    const response = await axios.post(
      `${baseURL}/auth/login`,
      { email, password }
    );

    await saveToken(response.data.access_token);
    setUser(response.data.user ?? response.data);
  };

  //Register new quiz account
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await axios.post(
      `${QUIZ_BASE_URL}/api/auth/register`,
      { name, email, password }
    );

    const { access_token, user } = response.data;

    await saveToken(access_token);
    setUser(user);
  };


  // 🚪 LOGOUT
  const logout = async () => {
    await clearAllAuthStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, register, login, logout }}
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
