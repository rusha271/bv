"use client";

import React, { useEffect, useRef } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBooks, clearBooksError } from '@/store/slices/blogSlice';
import { Book } from '@/utils/apiService';
import ErrorDisplay from '@/components/Error/ErrorDisplay';
import { CircularProgress, Box, Typography } from '@mui/material';

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className="w-full rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col border group"
      style={{
        background: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow =
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(255, 255, 255, 0.15)"
            : "0 10px 30px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.filter =
          theme.palette.mode === "dark" ? "brightness(1.1)" : "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          theme.palette.mode === "dark"
            ? "0 4px 15px rgba(255, 255, 255, 0.05)"
            : "0 4px 15px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.filter = "none";
      }}
    >
      {/* Image Section */}
      <div className="relative w-full" style={{ aspectRatio: '3/4', minHeight: '200px', maxHeight: '400px' }}>
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            style={{
              background: theme.palette.background.default,
            }}
            onError={(e) => {
              console.error('Failed to load book image:', book.image);
              console.error('Error event:', e);
            }}
            onLoad={() => {
              console.log('Book image loaded successfully:', book.image);
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: theme.palette.background.default,
              color: theme.palette.text.secondary,
            }}
          >
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">No Cover</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col" style={{ padding: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem' }}>
        <h2
          className="font-bold mb-2 leading-tight"
          style={{ 
            color: theme.palette.text.primary, 
            fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.25rem' 
          }}
        >
          {book.title}
        </h2>
        <p
          className="mb-1 font-medium"
          style={{ 
            color: theme.palette.primary.main, 
            fontSize: isMobile ? '0.85rem' : isTablet ? '0.9rem' : '1rem' 
          }}
        >
          by {book.author}
        </p>
        <p
          className="mb-4"
          style={{ 
            color: theme.palette.text.secondary, 
            fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem' 
          }}
        >
          {book.summary}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(book.rating)}</div>
            <span
              className="text-xs"
              style={{ 
                color: theme.palette.text.secondary,
                fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem'
              }}
            >
              {book.rating}
            </span>
          </div>
          <span
            className="text-xs px-2 py-1 rounded font-semibold cursor-default select-none"
            style={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {book.pages} PAGES
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BookCardsList() {
  const dispatch = useAppDispatch();
  const { data: books, loading, error } = useAppSelector((state) => state.blog.books);
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchBooks());
    }
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearBooksError());
    dispatch(fetchBooks());
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        py={4}
        width="100%"
      >
        <CircularProgress 
          size={48}
          sx={{ color: theme.palette.primary.main, mb: 2 }}
        />
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          Loading books...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load books"
        onRetry={handleRetry}
        variant="paper"
        retryText="Retry"
      />
    );
  }

  // Handle empty state
  if (!books || books.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-12 px-4"
        style={{
          background: theme.palette.background.default,
          minHeight: '200px',
        }}
      >
        <div 
          className="text-center"
          style={{ color: theme.palette.text.secondary }}
        >
          <h3 className="text-lg font-medium mb-2">No Books Available</h3>
          <p className="text-sm">Check back later for new Vastu books and resources.</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on number of items
  const getGridLayout = () => {
    const itemCount = books.length;
    
    if (itemCount === 1) {
      return 'grid-cols-1 max-w-md mx-auto';
    } else if (itemCount === 2) {
      return 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto';
    } else if (itemCount === 3) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div
      className={`grid ${getGridLayout()} gap-6`}
      style={{
        background: theme.palette.background.default,
        justifyItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
