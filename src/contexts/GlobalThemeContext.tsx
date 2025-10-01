'use client';
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';

interface GlobalThemeContextProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  theme: Theme;
  isDarkMode: boolean;
  isLightMode: boolean;
}

const GlobalThemeContext = createContext<GlobalThemeContextProps | undefined>(undefined);

export const useGlobalTheme = () => {
  const ctx = useContext(GlobalThemeContext);
  if (!ctx) throw new Error('useGlobalTheme must be used within GlobalThemeProvider');
  return ctx;
};

// Global theme configuration
const createGlobalTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#60a5fa' : '#3b82f6',
        light: isDark ? '#93c5fd' : '#60a5fa',
        dark: isDark ? '#2563eb' : '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#a78bfa' : '#8b5cf6',
        light: isDark ? '#c4b5fd' : '#a78bfa',
        dark: isDark ? '#7c3aed' : '#6d28d9',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0f172a' : '#ffffff',
        paper: isDark ? '#1e293b' : '#f8fafc',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: isDark ? [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.3)',
      '0 4px 6px rgba(0, 0, 0, 0.2)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 20px 25px rgba(0, 0, 0, 0.1)',
      '0 25px 50px rgba(0, 0, 0, 0.25)',
      ...Array(19).fill('0 25px 50px rgba(0, 0, 0, 0.25)'),
    ] : [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.1)',
      '0 4px 6px rgba(0, 0, 0, 0.05)',
      '0 10px 15px rgba(0, 0, 0, 0.05)',
      '0 20px 25px rgba(0, 0, 0, 0.05)',
      '0 25px 50px rgba(0, 0, 0, 0.1)',
      ...Array(19).fill('0 25px 50px rgba(0, 0, 0, 0.1)'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
          },
          contained: {
            boxShadow: isDark 
              ? '0 4px 14px rgba(59, 130, 246, 0.3)' 
              : '0 4px 14px rgba(59, 130, 246, 0.2)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark 
                ? '0 8px 25px rgba(59, 130, 246, 0.4)' 
                : '0 8px 25px rgba(59, 130, 246, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(148, 163, 184, 0.1)' 
              : '1px solid rgba(148, 163, 184, 0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(148, 163, 184, 0.1)' 
              : '1px solid rgba(148, 163, 184, 0.2)',
          },
        },
      },
    },
  });
};

export const GlobalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedMode = localStorage.getItem('globalThemeMode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Default to light mode
      setMode('light');
      localStorage.setItem('globalThemeMode', 'light');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('globalThemeMode', mode);
      // Update document theme attribute
      document.documentElement.setAttribute('data-theme', mode);
      document.documentElement.setAttribute('data-color-scheme', mode);
    }
  }, [mode, isInitialized]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => createGlobalTheme(mode), [mode]);

  const contextValue = useMemo(() => ({
    mode,
    toggleTheme,
    theme,
    isDarkMode: mode === 'dark',
    isLightMode: mode === 'light',
  }), [mode, theme]);

  // Prevent hydration mismatch
  if (!isInitialized) {
    return (
      <GlobalThemeContext.Provider value={{
        mode: 'light',
        toggleTheme: () => {},
        theme: createGlobalTheme('light'),
        isDarkMode: false,
        isLightMode: true,
      }}>
        <MuiThemeProvider theme={createGlobalTheme('light')}>
          {children}
        </MuiThemeProvider>
      </GlobalThemeContext.Provider>
    );
  }

  return (
    <GlobalThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </GlobalThemeContext.Provider>
  );
};
