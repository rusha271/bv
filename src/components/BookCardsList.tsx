"use client";

import React, { useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBooks, clearBooksError } from '@/store/slices/blogSlice';
import { Book } from '@/utils/blogApi';

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
      className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3
          className="font-bold text-lg mb-2 line-clamp-2"
          style={{ color: theme.palette.text.primary }}
        >
          {book.title}
        </h3>
        <p
          className="text-sm mb-2 font-medium"
          style={{ color: theme.palette.primary.main }}
        >
          by {book.author}
        </p>
        <p
          className="text-sm mb-3 line-clamp-3"
          style={{ color: theme.palette.text.secondary }}
        >
          {book.summary}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(book.rating)}</div>
            <span
              className="text-xs"
              style={{ color: theme.palette.text.secondary }}
            >
              {book.rating}
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: theme.palette.text.secondary }}
          >
            {book.pages} pages
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

  useEffect(() => {
    if (!books || books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books]);

  const handleRetry = () => {
    dispatch(clearBooksError());
    dispatch(fetchBooks());
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4" style={{ color: theme.palette.text.secondary }}>
          Loading books...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p style={{ color: theme.palette.error.main }}>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`grid gap-6 ${
          isMobile
            ? 'grid-cols-1'
            : isTablet
            ? 'grid-cols-2'
            : 'grid-cols-3'
        }`}
      >
        {books && books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
