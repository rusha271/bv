import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';
import { cachedApiCall } from '@/utils/apiCache';

// Async thunks for Books
export const fetchBooks = createAsyncThunk(
  'blog/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cachedApiCall(
        () => apiService.books.getAll(),
        '/api/blog/books',
        undefined,
        { ttl: 5 * 60 * 1000 } // Cache for 5 minutes to match backend
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const clearBooksError = createAsyncThunk(
  'blog/clearBooksError',
  async () => {
    return null;
  }
);

// Async thunks for Videos
export const fetchVideos = createAsyncThunk(
  'blog/fetchVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cachedApiCall(
        () => apiService.videos.getAll(),
        '/api/blog/videos',
        undefined,
        { ttl: 5 * 60 * 1000 } // Cache for 5 minutes to match backend
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch videos');
    }
  }
);

export const clearVideosError = createAsyncThunk(
  'blog/clearVideosError',
  async () => {
    return null;
  }
);

// Async thunks for Tips
export const fetchTips = createAsyncThunk(
  'blog/fetchTips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cachedApiCall(
        () => apiService.tips.getAll(),
        '/api/blog/tips',
        undefined,
        { ttl: 5 * 60 * 1000 } // Cache for 5 minutes to match backend
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tips');
    }
  }
);

export const clearTipsError = createAsyncThunk(
  'blog/clearTipsError',
  async () => {
    return null;
  }
);

// Async thunks for Podcasts
export const fetchPodcasts = createAsyncThunk(
  'blog/fetchPodcasts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cachedApiCall(
        () => apiService.podcasts.getAll(),
        '/api/blog/podcasts',
        undefined,
        { ttl: 5 * 60 * 1000 } // Cache for 5 minutes to match backend
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch podcasts');
    }
  }
);

export const clearPodcastsError = createAsyncThunk(
  'blog/clearPodcastsError',
  async () => {
    return null;
  }
);

// State interfaces
interface BlogState {
  books: {
    data: any[] | null;
    loading: boolean;
    error: string | null;
  };
  videos: {
    data: any[] | null;
    loading: boolean;
    error: string | null;
  };
  tips: {
    data: any[] | null;
    loading: boolean;
    error: string | null;
  };
  podcasts: {
    data: any[] | null;
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: BlogState = {
  books: {
    data: null,
    loading: false,
    error: null,
  },
  videos: {
    data: null,
    loading: false,
    error: null,
  },
  tips: {
    data: null,
    loading: false,
    error: null,
  },
  podcasts: {
    data: null,
    loading: false,
    error: null,
  },
};

// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Books reducers
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.books.loading = true;
        state.books.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books.loading = false;
        state.books.data = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.books.loading = false;
        state.books.error = action.payload as string;
      })
      .addCase(clearBooksError.fulfilled, (state) => {
        state.books.error = null;
      });

    // Videos reducers
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.videos.loading = true;
        state.videos.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.loading = false;
        state.videos.data = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.videos.loading = false;
        state.videos.error = action.payload as string;
      })
      .addCase(clearVideosError.fulfilled, (state) => {
        state.videos.error = null;
      });

    // Tips reducers
    builder
      .addCase(fetchTips.pending, (state) => {
        state.tips.loading = true;
        state.tips.error = null;
      })
      .addCase(fetchTips.fulfilled, (state, action) => {
        state.tips.loading = false;
        state.tips.data = action.payload;
      })
      .addCase(fetchTips.rejected, (state, action) => {
        state.tips.loading = false;
        state.tips.error = action.payload as string;
      })
      .addCase(clearTipsError.fulfilled, (state) => {
        state.tips.error = null;
      });

    // Podcasts reducers
    builder
      .addCase(fetchPodcasts.pending, (state) => {
        state.podcasts.loading = true;
        state.podcasts.error = null;
      })
      .addCase(fetchPodcasts.fulfilled, (state, action) => {
        state.podcasts.loading = false;
        state.podcasts.data = action.payload;
      })
      .addCase(fetchPodcasts.rejected, (state, action) => {
        state.podcasts.loading = false;
        state.podcasts.error = action.payload as string;
      })
      .addCase(clearPodcastsError.fulfilled, (state) => {
        state.podcasts.error = null;
      });
  },
});

export default blogSlice.reducer; 