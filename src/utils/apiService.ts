import { api } from './apiClient';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Types for API responses
export interface ApiResponse<T = any> {
  status: string;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  role: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// File Types
export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

// Floorplan Types
export interface FloorPlanAnalysis {
  id: string;
  user_id: number;
  file_id: number;
  image_data?: string;
  original_image_url?: string;
  cropped_image_url?: string;
  analysis_result?: string;
  vastu_score?: number;
  recommendations?: string;
  chakra_positions?: string;
  planet_influences?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface FloorPlanUpload {
  image_data: string;
  image_format: string;
  original_filename: string;
}



export interface Floorplan {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFloorplanRequest {
  name: string;
  description?: string;
  image_file: File;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatRequest {
  prompt?: string; // Make prompt optional since it's not always required
  message: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  message: string;
  context?: string;
}

// Enhanced Blog Types
export interface PostContent {
  type: 'text' | 'image' | 'video' | 'link' | 'file';
  content: string;
  metadata?: {
    url?: string;
    filename?: string;
    size?: number;
    duration?: string;
    thumbnail?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  description?: string;
  content: PostContent[] | string; // Support both old and new format
  author: string;
  published_at: string;
  tags: string[];
  category?: string;
  status?: 'draft' | 'published';
  post_type?: 'tip' | 'video' | 'book' | 'podcast' | 'article';
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBlogRequest {
  title: string;
  description?: string;
  content: PostContent[] | string; // Support both formats
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published';
  post_type?: 'tip' | 'video' | 'book' | 'podcast' | 'article';
  featured_image?: string;
  author?: string;
}

// Legal Types
export interface LegalDocument {
  id: string;
  type: 'terms' | 'privacy' | 'disclaimer';
  title: string;
  content: string;
  version: string;
  updated_at: string;
}

// Analytics Types
export interface AnalyticsData {
  page_views: number;
  unique_visitors: number;
  session_duration: number;
  bounce_rate: number;
}

// Contact Types
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Vastu Types
export interface VastuAnalysis {
  id: string;
  property_type: string;
  direction: string;
  recommendations: string[];
  score: number;
  created_at: string;
}

export interface VastuRequest {
  property_type: string;
  direction: string;
  floor_plan?: File;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  permissions: string[];
  created_at: string;
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

// Book Types
export interface Book {
  id: number;
  title: string;
  author: string;
  summary: string;
  image: string;
  rating: number;
  pages: number;
  price?: number;
  publication_year?: number;
  publisher?: string;
  category?: string;
  isbn?: string;
}

export interface BookCreate {
  title: string;
  author: string;
  summary: string;
  image: string;
  rating?: number;
  pages?: number;
  price?: number;
  publication_year?: number;
  publisher?: string;
  category?: string;
  isbn?: string;
}

export interface BookUpdate extends Partial<BookCreate> {}

// Video Types
export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail?: string; // Keep for backward compatibility
  thumbnail_url?: string; // New field from backend
  duration?: string | null;
  views: number;
  category?: string;
  upload_date?: string;
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
  video_type?: string;
}

export interface VideoCreate {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration?: string;
  category?: string;
}

export interface VideoUpdate extends Partial<VideoCreate> {}

// Podcast Types
export interface Podcast {
  id: number;
  title: string;
  description: string;
  audio_url: string;
  duration?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  category?: string;
}

export interface PodcastCreate {
  title: string;
  description: string;
  audio_url: string;
  duration?: string;
  thumbnail_url?: string;
  category?: string;
}

export interface PodcastUpdate extends Partial<PodcastCreate> {}

// Site Settings Types
export interface SiteSetting {
  id: number;
  category: 'logo' | 'tour_video' | 'chakra_points';
  file_path: string;
  meta_data?: any;
  created_at: string;
  updated_at: string;
  public_url?: string;
}

export interface SiteSettingResponse {
  success: boolean;
  message: string;
  data: SiteSetting;
  file_url: string;
}

export interface SiteSettingCreate {
  category: 'logo' | 'tour_video' | 'chakra_points';
  file: File;
  meta_data?: any;
}

export interface SiteSettingUpdate {
  meta_data?: any;
}

// Tip Types
export interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
  image?: string;
  image_url?: string;
  description?: string;
  details?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// API Service Class
class ApiService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly CACHE_KEY = 'site_settings_all_data';
  private static loadingPromise: Promise<any> | null = null;
  // Authentication Endpoints (/api/auth)
  auth = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      return api.post<AuthResponse>('/api/auth/login', data);
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      return api.post<AuthResponse>('/api/auth/register', data);
    },

    logout: async (): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/auth/logout');
    },

    refresh: async (): Promise<AuthResponse> => {
      return api.post<AuthResponse>('/api/auth/refresh');
    },

    me: async (): Promise<User> => {
      return api.get<User>('/api/auth/me');
    },

    forgotPassword: async (email: string): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, new_password: string): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/auth/reset-password', { token, new_password });
    },

    verifyEmail: async (token: string): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/auth/verify-email', { token });
    },

    resendVerification: async (): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/auth/resend-verification');
    },

    // Guest Account Endpoints
    createGuest: async (): Promise<AuthResponse> => {
      return api.post<AuthResponse>('/api/auth/guest/create');
    },

    upgradeGuest: async (data: RegisterRequest): Promise<AuthResponse> => {
      return api.post<AuthResponse>('/api/auth/guest/upgrade', data);
    },

    isGuest: async (): Promise<{ is_guest: boolean }> => {
      return api.get<{ is_guest: boolean }>('/api/auth/guest/check');
    }
  };

  // Users Endpoints (/api/users)
  users = {
    getAll: async (): Promise<User[]> => {
      return api.get<User[]>('/api/users');
    },

    getById: async (id: string): Promise<User> => {
      return api.get<User>(`/api/users/${id}`);
    },

    update: async (id: string, data: UpdateUserRequest): Promise<User> => {
      return api.put<User>(`/api/users/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/users/${id}`);
    },

    updateProfile: async (data: UpdateUserRequest): Promise<User> => {
      return api.put<User>('/api/users/profile', data);
    },

    changePassword: async (current_password: string, new_password: string): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/users/change-password', { current_password, new_password });
    }
  };

  // Files Endpoints (/api/files)
  files = {
    upload: async (data: FloorPlanUpload): Promise<FileUploadResponse> => {
      return api.post<FileUploadResponse>('/api/floorplan/upload', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    uploadMultiple: async (files: File[]): Promise<FileUploadResponse[]> => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      return api.post<FileUploadResponse[]>('/api/files/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    getById: async (id: string): Promise<FileUploadResponse> => {
      return api.get<FileUploadResponse>(`/api/files/${id}`);
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/files/${id}`);
    },

    getMyFiles: async (): Promise<FileUploadResponse[]> => {
      return api.get<FileUploadResponse[]>('/api/files/my-files');
    }
  };

  
  // Floorplan Endpoints (/api/floorplan)
  floorplan = {
    // ADD THIS NEW METHOD
    uploadFloorplan: async (imageFile: File): Promise<FloorPlanAnalysis> => {
      try {
        const base64Data = await fileToBase64(imageFile);
        const uploadData: FloorPlanUpload = {
          image_data: base64Data,
          image_format: imageFile.type.split("/")[1], // e.g. "jpeg" or "png"
          original_filename: imageFile.name
        };
        return api.post<FloorPlanAnalysis>('/api/floorplan/upload', uploadData, {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        throw new Error(`Failed to convert image to base64: ${error}`);
      }
    },
    
  
    // KEEP ALL YOUR EXISTING METHODS
    getAll: async (): Promise<Floorplan[]> => {
      return api.get<Floorplan[]>('/api/floorplan');
    },
  
    getById: async (id: string): Promise<Floorplan> => {
      return api.get<Floorplan>(`/api/floorplan/${id}`);
    },
  
    create: async (data: CreateFloorplanRequest): Promise<Floorplan> => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('image_file', data.image_file);
      return api.post<Floorplan>('/api/floorplan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  
    update: async (id: string, data: Partial<CreateFloorplanRequest>): Promise<Floorplan> => {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.image_file) formData.append('image_file', data.image_file);
      return api.put<Floorplan>(`/api/floorplan/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  
    delete: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/floorplan/${id}`);
    },
  
    analyze: async (id: string): Promise<VastuAnalysis> => {
      return api.post<VastuAnalysis>(`/api/admin/floorplan/${id}/analyze`);
    },

    // Get all floor plan analyses from admin endpoint
    getAnalyses: async (): Promise<FloorPlanAnalysis[]> => {
      return api.get<FloorPlanAnalysis[]>('/api/admin/floorplan-analyses');
    }
  };

  // Chat Endpoints (/api/chat)
  chat = {
    sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
      return api.post<ChatResponse>('/api/chat/send', data);
    },

    getHistory: async (): Promise<ChatMessage[]> => {
      return api.get<ChatMessage[]>('/api/chat/history');
    },

    clearHistory: async (): Promise<ApiResponse> => {
      return api.delete<ApiResponse>('/api/chat/history');
    },

    getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
      return api.get<ChatMessage[]>(`/api/chat/conversation/${conversationId}`);
    },

    getConversations: async (): Promise<{ id: string; title: string; last_message: string; created_at: string }[]> => {
      return api.get('/api/chat/conversations');
    }
  };

  // Blog Endpoints (/api/blog)
  blog = {
    getAll: async (): Promise<BlogPost[]> => {
      return api.get<BlogPost[]>('/api/blog');
    },

    getById: async (id: string): Promise<BlogPost> => {
      return api.get<BlogPost>(`/api/blog/${id}`);
    },

    create: async (data: CreateBlogRequest): Promise<BlogPost> => {
      return api.post<BlogPost>('/api/blog', data);
    },

    update: async (id: string, data: Partial<CreateBlogRequest>): Promise<BlogPost> => {
      return api.put<BlogPost>(`/api/blog/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/blog/${id}`);
    },

    getByTag: async (tag: string): Promise<BlogPost[]> => {
      return api.get<BlogPost[]>(`/api/blog/tag/${tag}`);
    },

    search: async (query: string): Promise<BlogPost[]> => {
      return api.get<BlogPost[]>(`/api/blog/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Legal Endpoints (/api/legal)
  legal = {
    getTerms: async (): Promise<LegalDocument> => {
      return api.get<LegalDocument>('/api/legal/terms');
    },

    getPrivacy: async (): Promise<LegalDocument> => {
      return api.get<LegalDocument>('/api/legal/privacy');
    },

    getDisclaimer: async (): Promise<LegalDocument> => {
      return api.get<LegalDocument>('/api/legal/disclaimer');
    },

    updateTerms: async (content: string): Promise<LegalDocument> => {
      return api.put<LegalDocument>('/api/legal/terms', { content });
    },

    updatePrivacy: async (content: string): Promise<LegalDocument> => {
      return api.put<LegalDocument>('/api/legal/privacy', { content });
    },

    updateDisclaimer: async (content: string): Promise<LegalDocument> => {
      return api.put<LegalDocument>('/api/legal/disclaimer', { content });
    }
  };

  // Analytics Endpoints (/api/analytics)
  analytics = {
    getDashboard: async (): Promise<AnalyticsData> => {
      return api.get<AnalyticsData>('/api/analytics/dashboard');
    },

    getPageViews: async (startDate?: string, endDate?: string): Promise<{ date: string; views: number }[]> => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      return api.get(`/api/analytics/page-views?${params.toString()}`);
    },

    trackEvent: async (event: string, properties?: Record<string, any>): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/analytics/track', { event, properties });
    },

    getUserAnalytics: async (): Promise<{ total_users: number; active_users: number; new_users: number }> => {
      return api.get('/api/analytics/users');
    }
  };

  // Contact Endpoints (/api/contact)
  contact = {
    sendMessage: async (data: ContactRequest): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/contact/consultation/simple', data);
    },

    getMessages: async (): Promise<ContactRequest[]> => {
      return api.get<ContactRequest[]>('/api/contact/messages');
    },

    getMessageById: async (id: string): Promise<ContactRequest> => {
      return api.get<ContactRequest>(`/api/contact/messages/${id}`);
    },

    deleteMessage: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/contact/messages/${id}`);
    }
  };

  // Vastu Endpoints (/api/vastu)
  vastu = {
    analyze: async (data: VastuRequest): Promise<VastuAnalysis> => {
      const formData = new FormData();
      formData.append('property_type', data.property_type);
      formData.append('direction', data.direction);
      if (data.floor_plan) formData.append('floor_plan', data.floor_plan);
      // Use apiClient directly for file upload
      return api.post<VastuAnalysis>('/api/vastu/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    getAnalysis: async (id: string): Promise<VastuAnalysis> => {
      return api.get<VastuAnalysis>(`/api/vastu/analysis/${id}`);
    },

    getMyAnalyses: async (): Promise<VastuAnalysis[]> => {
      return api.get<VastuAnalysis[]>('/api/vastu/my-analyses');
    },

    deleteAnalysis: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/vastu/analysis/${id}`);
    },

    getRecommendations: async (property_type: string, direction: string): Promise<string[]> => {
      return api.get<string[]>(`/api/vastu/recommendations?property_type=${property_type}&direction=${direction}`);
    }
  };

  // Books API
  books = {
    getAll: async (): Promise<Book[]> => {
      return api.get<Book[]>("/api/blog/books");
    },
    getById: async (id: number): Promise<Book> => {
      return api.get<Book>(`/api/blog/books/${id}`);
    },
    create: async (data: FormData): Promise<Book> => {
      return api.post<Book>("/api/blog/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(formData) => formData],
      });
    },
    update: async (id: number, data: BookUpdate): Promise<Book> => {
      return api.put<Book>(`/api/blog/books/${id}`, data);
    },
    delete: async (id: number): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/blog/books/${id}`);
    },
  };

  // Videos API
  videos = {
    getAll: async (): Promise<Video[]> => {
      return api.get<Video[]>("/api/blog/videos");
    },
    getById: async (id: number): Promise<Video> => {
      return api.get<Video>(`/api/blog/videos/${id}`);
    },
    create: async (data: FormData): Promise<Video> => {
      return api.post<Video>("/api/blog/videos", data, {
        headers: {
          "Content-Type": "multipart/form-data", // important for FormData
        },
        transformRequest: [(formData) => formData], // don't JSON.stringify
      });
    },
    update: async (id: number, data: FormData | VideoUpdate): Promise<Video> => {
      const isFormData = data instanceof FormData;
      return api.put<Video>(`/api/blog/videos/${id}`, data);
    },
    delete: async (id: number): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/blog/videos/${id}`);
    },
  };

  // Podcasts API
  podcasts = {
    getAll: async (): Promise<Podcast[]> => {
      return api.get<Podcast[]>("/api/blog/podcasts");
    },
    getById: async (id: number): Promise<Podcast> => {
      return api.get<Podcast>(`/api/blog/podcasts/${id}`);
    },
    create: async (data: FormData): Promise<Podcast> => {
      return api.post<Podcast>("/api/blog/podcasts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(formData) => formData],
      });
    },
    update: async (id: number, data: FormData | PodcastUpdate): Promise<Podcast> => {
      return api.put<Podcast>(`/api/blog/podcasts/${id}`, data);
    },
    delete: async (id: number): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/blog/podcasts/${id}`);
    },
  };

  // Tips API
  // (GET only, as per backend)
  tips = {
    getAll: async (): Promise<Tip[]> => {
      return api.get<Tip[]>("/api/blog/tips");
    },
    create: async (data: FormData): Promise<Tip> => {
      return api.post<Tip>("/api/blog/tips", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(formData) => formData],
      });
    },    
  };

  // Site Settings API
  siteSettings = {
    upload: async (category: string, file: File, metaData?: any): Promise<SiteSetting> => {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('file', file);
      if (metaData) {
        formData.append('meta_data', JSON.stringify(metaData));
      }
      return api.post<SiteSetting>('/api/site-settings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(formData) => formData],
      });
    },

    getAll: async (category?: string, skip?: number, limit?: number): Promise<SiteSetting[]> => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (skip !== undefined) params.append('skip', skip.toString());
      if (limit !== undefined) params.append('limit', limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/site-settings?${queryString}` : '/api/site-settings';
      return api.get<SiteSetting[]>(url);
    },

    getById: async (id: number): Promise<SiteSetting> => {
      return api.get<SiteSetting>(`/api/site-settings/${id}`);
    },

    getLatestByCategory: async (category: string): Promise<SiteSettingResponse> => {
      return api.get<SiteSettingResponse>(`/api/site-settings/category/${category}/latest`);
    },

    // Optimized method to get all latest site settings using existing endpoints with shared cache
    getLatestAllOptimized: async (): Promise<{
      data: {
        logo: SiteSetting | null;
        tour_video: SiteSetting | null;
        chakra_points: SiteSetting | null;
      };
      file_urls: {
        logo: string | null;
        tour_video: string | null;
        chakra_points: string | null;
      };
    }> => {
      // Import sessionCache dynamically to avoid circular imports
      const { sessionCache } = await import('./apiCache');
      
      // Check if we have valid cached data
      const cachedData = sessionCache.get(ApiService.CACHE_KEY);
      if (cachedData && cachedData.timestamp && 
          (Date.now() - cachedData.timestamp) < ApiService.CACHE_DURATION) {
        // console.log('🚀 Using cached site settings data');
        return {
          data: cachedData.data,
          file_urls: cachedData.file_urls
        };
      }

      // If there's already a loading promise, wait for it instead of making a new request
      if (ApiService.loadingPromise) {
        //  console.log('⏳ Waiting for existing API call to complete');
        return await ApiService.loadingPromise;
      }

      // console.log('📡 Fetching fresh site settings data from API - this should only happen once per 5 minutes');
      const categories = ['logo', 'tour_video', 'chakra_points'] as const;
      
      // Create a loading promise to prevent multiple simultaneous calls
      ApiService.loadingPromise = (async () => {
        try {
          // Use Promise.allSettled to handle individual failures gracefully
          const results = await Promise.allSettled(
            categories.map(category => 
              apiService.siteSettings.getLatestByCategory(category)
            )
          );

          const data: { logo: SiteSetting | null; tour_video: SiteSetting | null; chakra_points: SiteSetting | null } = {
            logo: null,
            tour_video: null,
            chakra_points: null
          };

          const file_urls: { logo: string | null; tour_video: string | null; chakra_points: string | null } = {
            logo: null,
            tour_video: null,
            chakra_points: null
          };

          // Process results
          results.forEach((result, index) => {
            const category = categories[index];
            if (result.status === 'fulfilled' && result.value) {
              data[category] = result.value.data;
              file_urls[category] = result.value.file_url;
            }
          });

          // Cache the results using sessionCache
          const cacheData = {
            data,
            file_urls,
            timestamp: Date.now()
          };
          
          sessionCache.set(ApiService.CACHE_KEY, cacheData, ApiService.CACHE_DURATION);
          // console.log('💾 Cached site settings data');

          return { data, file_urls };
        } finally {
          // Clear the loading promise when done
          ApiService.loadingPromise = null;
        }
      })();

      return await ApiService.loadingPromise;
    },

    // Method to get individual category with shared cache
    getLatestByCategoryCached: async (category: 'logo' | 'tour_video' | 'chakra_points'): Promise<{
      data: SiteSetting | null;
      file_url: string | null;
    }> => {
      // First try to get from shared cache
      const cached = await apiService.siteSettings.getLatestAllOptimized();
      
      return {
        data: cached.data[category],
        file_url: cached.file_urls[category]
      };
    },

    // Method to clear the shared cache (useful for testing or when data changes)
    clearCache: async () => {
      const { sessionCache } = await import('./apiCache');
      sessionCache.delete(ApiService.CACHE_KEY);
      ApiService.loadingPromise = null; // Clear any pending loading promise
      console.log('🗑️ Cleared site settings cache');
    },

    update: async (id: number, data: SiteSettingUpdate): Promise<SiteSetting> => {
      return api.put<SiteSetting>(`/api/site-settings/${id}`, data);
    },

    delete: async (id: number): Promise<{ message: string }> => {
      return api.delete<{ message: string }>(`/api/site-settings/${id}`);
    },

    getHistory: async (category: string): Promise<SiteSetting[]> => {
      return api.get<SiteSetting[]>(`/api/site-settings/history/${category}`);
    },
  };

  // Admin Endpoints (/api/admin)
  admin = {
    getLogo: async (): Promise<{ image_url: string }> => {
      return api.get<{ image_url: string }>('/api/admin/get-image');
    },

    uploadLogo: async (imageFile: File): Promise<{ image_url: string }> => {
      const formData = new FormData();
      formData.append('file', imageFile);
      return api.post<{ image_url: string }>('/api/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };

  // Vastu Chakra Points Endpoints (/api/admin/chakra-points) - Admin endpoints
  vastuChakraPoints = {
    getChakraPoints: async (): Promise<{ [key: string]: any }> => {
      return api.get<{ [key: string]: any }>('/api/admin/chakra-points');
    },

    getChakraPoint: async (chakraId: string): Promise<any> => {
      return api.get<any>(`/api/admin/chakra-points/${chakraId}`);
    },

    updateChakraPoint: async (chakraId: string, chakraData: any): Promise<any> => {
      return api.put<any>(`/api/admin/chakra-points/${chakraId}`, chakraData);
    },

    createChakraPoint: async (chakraData: any): Promise<any> => {
      return api.post<any>('/api/admin/chakra-points', chakraData);
    },

    deleteChakraPoint: async (chakraId: string): Promise<void> => {
      return api.delete<void>(`/api/admin/chakra-points/${chakraId}`);
    }
  };

  // Utility method to get base URL
  getBaseURL = (): string => {
    return api.getBaseURL();
  };

  // Roles Endpoints (/api/roles)
  roles = {
    getAll: async (): Promise<Role[]> => {
      return api.get<Role[]>('/api/roles');
    },

    getById: async (id: string): Promise<Role> => {
      return api.get<Role>(`/api/roles/${id}`);
    },

    create: async (data: CreateRoleRequest): Promise<Role> => {
      return api.post<Role>('/api/roles', data);
    },

    update: async (id: string, data: Partial<CreateRoleRequest>): Promise<Role> => {
      return api.put<Role>(`/api/roles/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/roles/${id}`);
    },

    assignRole: async (userId: string, roleId: string): Promise<ApiResponse> => {
      return api.post<ApiResponse>('/api/roles/assign', { user_id: userId, role_id: roleId });
    },

    removeRole: async (userId: string, roleId: string): Promise<ApiResponse> => {
      return api.delete<ApiResponse>(`/api/roles/assign?user_id=${userId}&role_id=${roleId}`);
    }
  };
}

// Create and export the API service instance
export const apiService = new ApiService();

// Export individual services for convenience
export const {
  auth,
  users,
  files,
  floorplan,
  chat,
  blog,
  legal,
  analytics,
  contact,
  vastu,
  roles,
  books,
  videos,
  tips,
  admin,
  vastuChakraPoints,
  siteSettings
} = apiService;

export default apiService;