import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { blogApi, Tip, Book, Video } from '@/utils/blogApi';

// Async thunks
export const fetchTips = createAsyncThunk(
  'blog/fetchTips',
  async (_, { rejectWithValue }) => {
    try {
      const tips = await blogApi.getTips();
      return tips;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tips');
    }
  }
);

export const fetchBooks = createAsyncThunk(
  'blog/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const books = await blogApi.getBooks();
      return books;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchVideos = createAsyncThunk(
  'blog/fetchVideos',
  async (_, { rejectWithValue }) => {
    try {
      const videos = await blogApi.getVideos();
      return videos;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch videos');
    }
  }
);

// State interface
interface BlogState {
  tips: {
    data: Tip[];
    loading: boolean;
    error: string | null;
  };
  books: {
    data: Book[];
    loading: boolean;
    error: string | null;
  };
  videos: {
    data: Video[];
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: BlogState = {
  tips: {
    data: [],
    loading: false,
    error: null,
  },
  books: {
    data: [],
    loading: false,
    error: null,
  },
  videos: {
    data: [],
    loading: false,
    error: null,
  },
};

// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearTipsError: (state) => {
      state.tips.error = null;
    },
    clearBooksError: (state) => {
      state.books.error = null;
    },
    clearVideosError: (state) => {
      state.videos.error = null;
    },
  },
  extraReducers: (builder) => {
    // Tips
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
      });

    // Books
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
      });

    // Videos
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
      });
  },
});

export const { clearTipsError, clearBooksError, clearVideosError } = blogSlice.actions;
export default blogSlice.reducer;
