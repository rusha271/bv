'use client';

import { useState } from 'react';
import api from '@/utils/apiClient';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setStatus(`Success: ${response.message}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">API Connection Test</h3>
      <p className="mb-2">Status: {status}</p>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
    </div>
  );
}
