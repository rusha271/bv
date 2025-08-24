import { useState, useCallback } from 'react';
import { apiService, VastuRequest, FloorPlanUpload } from './apiService';
import { validateImageFormat, getImageMimeType, base64ToFile } from './imageUtils';

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

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Convert File to base64 for API
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const format = file.type.split('/')[1]; // e.g., 'png', 'jpeg'
      
      const uploadData = {
        image_data: base64Data,
        image_format: format,
        original_filename: file.name,
      };

      const result = await apiService.files.upload(uploadData);
      setUploadedFiles(prev => [...prev, result]);
      setProgress(100);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const uploadBase64Image = useCallback(async (
    base64Data: string, 
    originalFilename: string, 
    format: string
  ) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      if (!validateImageFormat(format)) {
        throw new Error(`Unsupported image format: ${format}`);
      }

      const mimeType = getImageMimeType(format);
      const file = base64ToFile(base64Data, originalFilename, mimeType);
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size too large. Maximum allowed: ${maxSize / (1024 * 1024)}MB`);
      }

      setProgress(50);
      
      const result = await uploadFile(file);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Base64 upload failed';
      setError(errorMessage);
      throw err;
    }
  }, [uploadFile]);

  const uploadMultipleFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      const results = await apiService.files.uploadMultiple(files);
      setUploadedFiles(prev => [...prev, ...results]);
      setProgress(100);
      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
  }, []);

  return {
    uploading,
    uploadedFiles,
    error,
    progress,
    uploadFile,
    uploadBase64Image,
    uploadMultipleFiles,
    removeFile,
    clearFiles,
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
      const response = await apiService.chat.sendMessage({ message, context, prompt: context });
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
      const errorMessage = err.message || 'Failed to load chat history';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await apiService.chat.clearHistory();
      setMessages([]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clear chat history';
      setError(errorMessage);
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

export const useFloorPlanUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFloorplan = useCallback(async (imageFile: File) => {
    setUploading(true);
    setError(null);
    try {
      const format = imageFile.type.split('/')[1]; // e.g., 'png', 'jpeg'
      if (!validateImageFormat(format)) {
        throw new Error(`Unsupported image format: ${format}`);
      }

      const result = await apiService.floorplan.uploadFloorplan(imageFile);
      setAnalysis(result);
      return result;
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
    analysis,
    error,
    uploadFloorplan,
  };
};

// Vastu analysis hook
export const useVastuAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (propertyType: string, direction: string, floorPlanFile?: File) => {
    setAnalyzing(true);
    setError(null);
    try {
      const requestData: VastuRequest = {
        property_type: propertyType,
        direction: direction
      };
      
      const result = await apiService.vastu.analyze(requestData);
      // Handle file separately if needed
      setAnalyses(prev => [result, ...prev]);
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
      const errorMessage = err.message || 'Failed to load analyses';
      setError(errorMessage);
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

  const sendMessage = useCallback(async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      await apiService.contact.sendMessage(data);
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
      const results = await apiService.analytics.getDashboard();
      setData(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackEvent = useCallback(async (event: string, properties?: any) => {
    try {
      await apiService.analytics.trackEvent(event, properties);
    } catch (err: any) {
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
  useFileUpload,
  useChat,
  useVastuAnalysis,
  useBlog,
  useContact,
  useAnalytics,
  useApiCall,
}; 