import { getBaseUrl, getToken } from '@/utils/secureStorage';
import axios from 'axios';

export const laravelClient = axios.create();

laravelClient.interceptors.request.use(
  async (config) => {
    const baseURL = await getBaseUrl() || 'https://core.edukasof.com/api/app';
    const token = await getToken();

    if (baseURL) config.baseURL = baseURL;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

