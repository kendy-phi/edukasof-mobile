import { getBaseUrl, getToken } from "@/utils/secureStorage";
import axios from "axios";

export const createLaravelClient = async () => {
  const baseURL = await getBaseUrl() || 'https://core.edukasof.com/api/app';
  const token = await getToken();

  const api = axios.create({ baseURL });

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return api;
};
