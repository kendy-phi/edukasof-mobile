import axios from 'axios';
import { ENV } from '../config/env';

export const nestApi = axios.create({
  baseURL: ENV.NEST_API,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});
