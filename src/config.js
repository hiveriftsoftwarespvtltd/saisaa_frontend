import axios from 'axios';
import { API_ENDPOINTS } from './api/endpoints';

export { API_ENDPOINTS };

// Backend Base URL
export const API_BASE_URL =
  // import.meta.env.VITE_API_BASE_URL || 'http://localhost:6001/api/v1';
  import.meta.env.VITE_API_BASE_URL || 'https://api.saisaa.com/api/v1';

// Pre-configured Axios Client with interceptors
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('saisaa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Parse Unified NestJS Response & Errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const validationErrors = Array.isArray(errorData?.errors)
      ? errorData.errors.join(', ')
      : null;

    const errorMessage =
      validationErrors ||
      errorData?.message ||
      error.message ||
      'Unable to connect to SAISAA servers. Please try again.';

    return Promise.reject(new Error(errorMessage));
  },
);

export default {
  API_BASE_URL,
  apiClient,
  API_ENDPOINTS,
};
