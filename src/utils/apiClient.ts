import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error);
    
    // Handle different error types
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error occurred');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async <T = any>(url: string, params?: any): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // DELETE request
  delete: async <T = any>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Error handling helper
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || data?.detail || 'An error occurred',
      data: data || null,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      message: 'Network error - please check your connection',
      data: null,
    };
  } else {
    // Something else happened
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
