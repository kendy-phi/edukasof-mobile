import { getToken } from "@/utils/secureStorage";
import axios from "axios";

export const quizClient = axios.create({
  baseURL: "http://192.168.192.6:3250/api/v1",//"https://quiz.edukasof.com",
});

quizClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
