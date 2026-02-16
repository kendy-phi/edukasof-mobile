import { useTenant } from '@/context/TenantContext';
import {
  clearAllAuthStorage,
  getToken,
  saveToken,
} from '@/utils/secureStorage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (name: string, email: string, passowrd: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
//quiz.edukasof.com
const QUIZ_BASE_URL = "http://192.168.192.6:3250/api/v1";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenant } = useTenant();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // 🔹 Retourne la bonne URL d'auth selon le type
  const getAuthBaseURL = (): string => {
    if (!tenant) throw new Error("No tenant selected");

    if (tenant.type === "full") {
      if (!tenant.baseURL) {
        throw new Error("Missing Laravel baseURL");
      }
      return tenant.baseURL;
    }

    return QUIZ_BASE_URL;
  };

  // 🔄 Auto login au démarrage
  useEffect(() => {
    const loadUser = async () => {
      if (!tenant) {
        setLoading(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const baseURL = getAuthBaseURL();

        const response = await axios.get(
          `${baseURL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        await clearAllAuthStorage();
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [tenant]);

  // 🔐 Login
  const login = async (email: string, password: string) => {
    if (!tenant) throw new Error("No tenant selected");
    let isOk = false;
    let response = null;
    const baseURL = getAuthBaseURL();
    console.log("Login URL: ", `${baseURL}/auth/login`);
    try {
      response = await axios.post(
        `${baseURL}/auth/login`,
        { email, password }
      );
      isOk = true;
    } catch (error: any) {

      console.log(error);

    } finally {
      if (isOk) {
        const { accessToken, user } = response?.data;
        console.log(accessToken, user);
        
        // console.log("Response data: ", response?.data, "Saved token: ", accessToken);

        await saveToken(accessToken);
        setUser(user);
      }
    }
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


  // 🚪 Logout
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
