
interface LoginInterface {
    email: string;
    password: string;
};

interface RegisterInterface {
    name: string;
    email: string;
    password: string;
};

import { AxiosInstance } from 'axios';

export const authApi = (api: AxiosInstance) => ({

    login: async (credentials: LoginInterface) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterInterface) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
});