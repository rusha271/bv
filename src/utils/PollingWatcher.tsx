'use client';

import { useEffect } from 'react';
import api from '@/utils/axios';

export default function AutoPollingWatcher() {
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const endpoints = [
      'http://localhost:8000/trigger-reload', // Can add more later
    ];

    const interval = setInterval(async () => {
      try {
        for (const endpoint of endpoints) {
          const res = await api.get(endpoint.replace('trigger-reload', 'should-reload'));
          const data = res.data;
          if (data?.reload) {
            window.location.reload();
            break;
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3001);

    return () => clearInterval(interval);
  }, []);

  return null;
}
