import api from './apiClient';

export interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  summary: string;
  image: string;
  rating: number;
  pages: number;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: number;
}

export interface ConsultationRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  concernType: string;
}

export interface ChatRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  response: string;
  model: string;
}

// Blog API functions
export const blogApi = {
  // Get tips
  getTips: async (): Promise<Tip[]> => {
    try {
      const response = await api.get<Tip[]>('/api/blog/tips');
      return response;
    } catch (error: any) {
      console.error('Error fetching tips:', error);
      throw new Error(error.message || 'Failed to fetch tips');
    }
  },

  // Get books
  getBooks: async (): Promise<Book[]> => {
    try {
      const response = await api.get<Book[]>('/api/blog/books');
      return response;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Get videos
  getVideos: async (): Promise<Video[]> => {
    try {
      const response = await api.get<Video[]>('/api/blog/videos');
      return response;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Submit consultation request
  submitConsultation: async (data: ConsultationRequest): Promise<any> => {
    try {
      const response = await api.post<any>('/api/contact/consultation/simple', data);
      return response;
    } catch (error) {
      console.error('Error submitting consultation:', error);
      throw error;
    }
  },

  // Chat with AI
  chatWithAI: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/api/chat/simple', request);
      return response;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  },
};
