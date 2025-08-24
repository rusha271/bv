import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export { useAppDispatch, useAppSelector } from './hooks'; 