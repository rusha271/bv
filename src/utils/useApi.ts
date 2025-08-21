import { useState, useCallback } from 'react';
import { apiService } from './apiService';

// Generic hook for API calls with loading and error states
export const useApiCall = <T = any, P = any>(
  apiFunction: (params: P) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(params);
        setData(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, loading, error, execute };
};

// Authentication hooks
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.login({ email, password });
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.register({ name, email, password });
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = await apiService.auth.me();
      setUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Failed to get user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  };
};

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const result = await apiService.files.upload(file);
      setUploadedFiles(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setError(null);
    try {
      const results = await apiService.files.uploadMultiple(files);
      setUploadedFiles(prev => [...prev, ...results]);
      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploading,
    uploadedFiles,
    error,
    uploadFile,
    uploadMultipleFiles,
  };
};

// Chat hook
export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, context?: string) => {
    setSending(true);
    setError(null);
    try {
      const response = await apiService.chat.sendMessage({ message, context });
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user' as const,
        timestamp: new Date().toISOString(),
      };
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant' as const,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage, assistantMessage]);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const history = await apiService.chat.getHistory();
      setMessages(history);
      return history;
    } catch (err: any) {
      setError(err.message || 'Failed to load chat history');
      throw err;
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await apiService.chat.clearHistory();
      setMessages([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear history');
      throw err;
    }
  }, []);

  return {
    messages,
    sending,
    error,
    sendMessage,
    loadHistory,
    clearHistory,
  };
};

// Vastu analysis hook
export const useVastuAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (propertyType: string, direction: string, floorPlan?: File) => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await apiService.vastu.analyze({
        property_type: propertyType,
        direction,
        floor_plan: floorPlan,
      });
      setAnalyses(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const loadMyAnalyses = useCallback(async () => {
    try {
      const results = await apiService.vastu.getMyAnalyses();
      setAnalyses(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to load analyses');
      throw err;
    }
  }, []);

  return {
    analyzing,
    analyses,
    error,
    analyze,
    loadMyAnalyses,
  };
};

// Blog hooks
export const useBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const results = await apiService.blog.getAll();
      setPosts(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (title: string, content: string, tags?: string[]) => {
    try {
      const result = await apiService.blog.create({ title, content, tags });
      setPosts(prev => [result, ...prev]);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
      throw err;
    }
  }, []);

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
  };
};

// Contact form hook
export const useContact = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = useCallback(async (name: string, email: string, subject: string, message: string) => {
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      await apiService.contact.sendMessage({ name, email, subject, message });
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  return {
    sending,
    error,
    success,
    sendMessage,
  };
};

// Analytics hook
export const useAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.analytics.getDashboard();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackEvent = useCallback(async (event: string, properties?: Record<string, any>) => {
    try {
      await apiService.analytics.trackEvent(event, properties);
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, []);

  return {
    data,
    loading,
    error,
    loadDashboard,
    trackEvent,
  };
};

export default {
  useAuth,
  useFileUpload,
  useChat,
  useVastuAnalysis,
  useBlog,
  useContact,
  useAnalytics,
  useApiCall,
}; 