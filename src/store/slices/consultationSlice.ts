import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { blogApi, ConsultationRequest } from '@/utils/blogApi';

// Async thunks
export const submitConsultation = createAsyncThunk(
  'consultation/submit',
  async (consultationData: ConsultationRequest, { rejectWithValue }) => {
    try {
      const response = await blogApi.submitConsultation(consultationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit consultation');
    }
  }
);

// State interface
interface ConsultationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  submissions: any[];
}

// Initial state
const initialState: ConsultationState = {
  loading: false,
  error: null,
  success: false,
  submissions: [],
};

// Slice
const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetForm: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitConsultation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submissions.push(action.payload);
      })
      .addCase(submitConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetForm } = consultationSlice.actions;
export default consultationSlice.reducer;
