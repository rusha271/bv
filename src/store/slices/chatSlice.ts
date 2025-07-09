import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { blogApi, ChatRequest, ChatResponse } from '@/utils/blogApi';

// Async thunks
export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (chatRequest: ChatRequest, { rejectWithValue }) => {
    try {
      const response = await blogApi.chatWithAI(chatRequest);
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
}

// Initial state
const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
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
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
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
          id: Date.now().toString(),
          message: action.payload.request.prompt,
          isUser: true,
          timestamp: action.payload.timestamp,
        };
        state.messages.push(userMessage);
        
        // Add AI response
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: action.payload.response.response,
          isUser: false,
          timestamp: action.payload.timestamp,
        };
        state.messages.push(aiMessage);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
