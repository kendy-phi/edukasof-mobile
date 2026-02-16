import { getToken } from "@/utils/secureStorage";
import axios from "axios";

export const quizClient = axios.create({
  baseURL: "https://quiz.edukasof.com",
});

quizClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
