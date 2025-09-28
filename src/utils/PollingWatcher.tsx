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

    const interval = setInterval(async () => {
      try {
        for (const endpoint of endpoints) {
          const res = await api.get(endpoint);
          const data = res.data;
          if (data?.reload) {
            // Use router.refresh() for client-side refresh instead of full page reload
            // This preserves the current page state while refreshing data
            router.refresh();
            break;
          }
        }
      } catch (err) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Polling error:", err);
        }
      }
    }, 3001);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
