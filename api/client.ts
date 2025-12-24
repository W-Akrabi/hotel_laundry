import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(API_CONFIG.SUPABASE_ANON_KEY
      ? {
          apikey: API_CONFIG.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
        }
      : {}),
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // You can add authentication token here if needed
    // const token = await AsyncStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status } = error.response;
      
      // Handle unauthorized errors (401)
      if (status === 401 && !originalRequest._retry) {
        // You can implement token refresh logic here
        // originalRequest._retry = true;
        // Refresh token and retry the request
      }
      
      // Handle forbidden errors (403)
      if (status === 403) {
        // Handle forbidden access
        console.error('Access forbidden');
      }
      
      // Handle not found errors (404)
      if (status === 404) {
        console.error('Resource not found');
      }
      
      // Handle server errors (500)
      if (status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network error - no response received');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for API requests
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then((response: AxiosResponse<T>) => response.data);
  },
};

export default apiClient;
