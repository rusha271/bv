'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient as api } from '@/utils/apiClient';

export default function AutoPollingWatcher() {
  const router = useRouter();

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    // Use the API_BASE_URL instead of hardcoded localhost
    const endpoints = [
      `${API_BASE_URL}/should-reload`, // Fixed endpoint name
    ];

    // Use requestIdleCallback for polling to prevent blocking the main thread
    const pollWithIdleCallback = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          try {
            for (const endpoint of endpoints) {
              const res = await api.get(endpoint);
              const data = res.data;
              if (data?.reload) {
                // Use requestAnimationFrame to batch router refresh
                requestAnimationFrame(() => {
                  router.refresh();
                });
                break;
              }
            }
          } catch (err) {
            // Only log errors in development
            if (process.env.NODE_ENV === 'development') {
              console.error("Polling error:", err);
            }
          }
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          try {
            for (const endpoint of endpoints) {
              const res = await api.get(endpoint);
              const data = res.data;
              if (data?.reload) {
                requestAnimationFrame(() => {
                  router.refresh();
                });
                break;
              }
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Polling error:", err);
            }
          }
        }, 0);
      }
    };

    const interval = setInterval(pollWithIdleCallback, 3001);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
