import axios from 'axios';
import { API_ENDPOINTS } from './api/endpoints';

export { API_ENDPOINTS };

// Backend Base URL with smart auto-detection (Localhost -> port 6001, Production -> api.saisaa.com)
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:6001/api/v1'
    : 'https://api.saisaa.com/api/v1');

/**
 * Resolves media URLs cleanly across localhost, production, and cloud environments.
 * Converts any local or insecure paths to production HTTPS endpoints when running on live site.
 */
export const resolveProductImageUrl = (url, fallback = '/images/05_shop_product_card_1.jpg') => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  let resolved = url.trim();

  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // If on live production, replace localhost:6001 with production API
  if (!isLocal && resolved.includes('localhost:6001')) {
    resolved = resolved.replace(/https?:\/\/localhost:6001/g, 'https://api.saisaa.com');
  }

  // Ensure HTTPS for production domain to prevent mixed content blocks
  if (resolved.startsWith('http://api.saisaa.com/')) {
    resolved = resolved.replace('http://api.saisaa.com/', 'https://api.saisaa.com/');
  }

  // Relative /uploads/ path
  if (resolved.startsWith('/uploads/')) {
    const base = isLocal ? 'http://localhost:6001' : 'https://api.saisaa.com';
    resolved = `${base}${resolved}`;
  }

  return resolved;
};

// Razorpay Public Client Key (Safe for frontend bundle)
export const RAZORPAY_KEY_ID =
  import.meta.env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_Tqs7ZkrK4xTtmd';


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
  RAZORPAY_KEY_ID,
};

