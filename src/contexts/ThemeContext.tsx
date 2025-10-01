'use client';
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';

interface ThemeContextProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
};

const baseTheme = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light'); // Default to 'light' for SSR
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Sync mode with localStorage on client-side only
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
      console.log('Theme loaded from localStorage:', savedMode);
    } else {
      // Force light mode if no saved theme
      setMode('light');
      console.log('No saved theme found, forcing light mode');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('themeMode', mode);
      console.log('Theme saved to localStorage:', mode);
    }
  }, [mode, isInitialized]);

  // Force theme refresh when mode changes
  useEffect(() => {
    if (isInitialized) {
      // Force a re-render by updating the document theme
      document.documentElement.setAttribute('data-theme', mode);
      console.log('Document theme attribute set to:', mode);
    }
  }, [mode, isInitialized]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode,
          ...(mode === 'dark' && {
            text: {
              primary: '#ffffff',
              secondary: '#b0b0b0',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
        },
      }),
    [mode]
  );

  // Prevent theme flickering by not rendering until initialized
  if (!isInitialized) {
    console.log('Theme not initialized, using light theme fallback');
    return (
      <ThemeContext.Provider value={{ mode: 'light', toggleTheme: () => {}, theme: createTheme(baseTheme) }}>
        <MuiThemeProvider theme={createTheme(baseTheme)}>{children}</MuiThemeProvider>
      </ThemeContext.Provider>
    );
  }

  // console.log('ThemeProvider rendering with mode:', mode, 'isInitialized:', isInitialized);
  
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};