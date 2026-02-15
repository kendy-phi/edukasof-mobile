import { nestApi } from '@/api/nest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('TOKEN');
      const savedUser = await AsyncStorage.getItem('USER');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        nestApi.defaults.headers.common['Authorization'] =
          `Bearer ${savedToken}`;
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await nestApi.post('/auth/login', {
      email,
      password,
    });

    const { access_token, user } = response.data;

    setToken(access_token);
    setUser(user);

    nestApi.defaults.headers.common['Authorization'] =
      `Bearer ${access_token}`;

    await AsyncStorage.setItem('TOKEN', access_token);
    await AsyncStorage.setItem('USER', JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);

    delete nestApi.defaults.headers.common['Authorization'];

    await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.removeItem('USER');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
