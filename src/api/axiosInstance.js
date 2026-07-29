import axios from 'axios';
import { showToast } from '../utils/toast';
import { getEnvVar } from '../utils/env';
import { normalizeApiError } from './apiNormalizer';

const API_BASE_URL = getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5000/api');


export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});


axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('rentify_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const normalized = normalizeApiError(error);
    const status = normalized.status;
    const isAuthEndpoint =
      error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/auth/logout');

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rentify_token');
        localStorage.removeItem('rentify_user');
      }
      if (!isAuthEndpoint) {
        showToast.error('Session expired or unauthorized. Please log in again.');
      }
    } else if (status === 403) {
      showToast.error('Access Denied (403): You do not have permission for this resource.');
    } else if (status >= 500) {
      showToast.error('Server Error (500): Unable to process request.');
    }

    return Promise.reject(normalized);
  }
);

export default axiosInstance;
