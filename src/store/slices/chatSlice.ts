import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService, ChatRequest, ChatResponse } from '@/utils/apiService';

// Helper function to generate stable IDs
const generateId = (prefix: string, index: number) => `${prefix}-${index}-${Date.now()}`;

// Async thunks
export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (chatRequest: ChatRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.chat.sendMessage(chatRequest);
      return {
        request: chatRequest,
        response: response,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// State interface
interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  messageIndex: number; // For generating stable IDs
}

// Initial state
const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  messageIndex: 0,
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.messageIndex = 0;
    },
    addMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id'>>) => {
      const newMessage: ChatMessage = {
        ...action.payload,
        id: generateId(action.payload.isUser ? 'user' : 'bot', state.messageIndex),
      };
      state.messages.push(newMessage);
      state.messageIndex += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add user message
        const userMessage: ChatMessage = {
          id: generateId('user', state.messageIndex),
          message: action.payload.request.prompt,
          isUser: true,
          timestamp: action.payload.timestamp,
        };
        state.messages.push(userMessage);
        state.messageIndex += 1;
        
        // Add AI response
        const aiMessage: ChatMessage = {
          id: generateId('bot', state.messageIndex),
          message: action.payload.response.response,
          isUser: false,
          timestamp: action.payload.timestamp,
        };
        state.messages.push(aiMessage);
        state.messageIndex += 1;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
