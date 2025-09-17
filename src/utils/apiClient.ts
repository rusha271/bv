import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  headers: any; 
}

// Storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_ME_KEY = 'remember_me';

// Helper functions
const getStorage = () => {
  if (typeof window === 'undefined') return localStorage;
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  return rememberMe ? localStorage : sessionStorage;
};

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const storage = getStorage();
  return storage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const storage = getStorage();
  return storage.getItem(REFRESH_TOKEN_KEY);
};

const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor - Dynamic token fetching
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token
      if (config.headers) {
        delete config.headers.Authorization;
      }
    }
    
    // console.log(`Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    // console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Enhanced error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  async (error: AxiosError) => {
    // console.error('Response error:', error);
    
    const originalRequest = error.config as InternalAxiosRequestConfig;
    
    if (error.response?.status === 401) {
      // Handle 401 Unauthorized
      const refreshToken = getRefreshToken();
      
      if (refreshToken && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const response = await axios.post(`${API_CONFIG.baseURL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          const storage = getStorage();
          storage.setItem(ACCESS_TOKEN_KEY, access_token);
          
          // Retry the original request with new token
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          // console.error('Token refresh failed:', refreshError);
          clearTokens();
          
          // Dispatch custom event for auth context to handle
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout', { 
              detail: { reason: 'token_refresh_failed' } 
            }));
          }
          
          return Promise.reject({
            status: 401,
            message: 'Invalid or expired token. Please log in again.',
            data: null,
          });
        }
      } else {
        // No refresh token or already retried
        clearTokens();
        
        // Dispatch custom event for auth context to handle
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout', { 
            detail: { reason: 'unauthorized' } 
          }));
        }
        
        return Promise.reject({
          status: 401,
          message: 'Invalid or expired token. Please log in again.',
          data: null,
        });
      }
    } else if (error.response?.status === 403) {
      // console.error('Access forbidden');
      return Promise.reject({
        status: 403,
        message: 'Access forbidden. You do not have permission to perform this action.',
        data: null,
      });
    } else if (error.response?.status === 500) {
      // console.error('Server error occurred');
      return Promise.reject({
        status: 500,
        message: 'Server error occurred. Please try again later.',
        data: null,
      });
    } else if (error.code === 'ECONNABORTED') {
      //  console.error('Request timeout');
      return Promise.reject({
        status: 0,
        message: 'Request timeout. Please check your connection and try again.',
        data: null,
      });
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: async <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const mergedConfig = { ...config, params };
      const response = await apiClient.get<T>(url, mergedConfig);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getBaseURL: (): string => {
    return API_CONFIG.baseURL;
  }
};

// Error handling helper
const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || data?.detail || 'An error occurred',
      data: data || null,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Network error - please check your connection',
      data: null,
    };
  } else {
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      data: null,
    };
  }
};

// Export the axios instance for advanced usage
export { apiClient };
export default api;