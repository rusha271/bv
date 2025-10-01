"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";


// Dummy data for visitor sessions over the last 30 days
const generateDummyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: Math.floor(Math.random() * 200) + 50,
      visitors: Math.floor(Math.random() * 150) + 30,
    });
  }
  
  return data;
};

export default function OrganicSessionsChart() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchSessionsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would fetch from your analytics API
        // const response = await fetch('/api/analytics/sessions');
        // const sessionsData = await response.json();
        
        // For now, we'll use dummy data
        setData(generateDummyData());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions data:', err);
        setError('Failed to load sessions data');
        setLoading(false);
        // Keep using dummy data as fallback
        setData(generateDummyData());
      }
    };

    fetchSessionsData();
  }, [mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`rounded-xl shadow-lg p-6 border ${
        mode === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className={`h-6 rounded w-1/3 mb-4 ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-64 rounded ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  // Simple chart data display without Recharts
  const maxSessions = data.length > 0 ? Math.max(...data.map(d => d.sessions)) : 1;
  const maxVisitors = data.length > 0 ? Math.max(...data.map(d => d.visitors)) : 1;

  if (loading) {
    return (
      <div className={`rounded-lg shadow p-6 ${
        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="animate-pulse">
          <div className={`h-6 rounded w-1/3 mb-4 ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-64 rounded ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg p-6 border ${
      mode === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg mr-4 ${
            mode === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
          }`}>
            <BarChart3 className={`h-6 w-6 ${
              mode === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Visitor Sessions</h3>
            <p className={`text-sm font-medium ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Last 30 days</p>
          </div>
        </div>
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-semibold">+15%</span>
        </div>
      </div>

      {error && (
        <div className={`rounded-lg p-4 mb-4 ${
          mode === 'dark' 
            ? 'bg-red-900 border border-red-700' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            mode === 'dark' ? 'text-red-300' : 'text-red-600'
          }`}>{error}</p>
        </div>
      )}

      <div className="h-64 p-4">
        <div className="h-full flex items-end justify-between space-x-1">
          {data.length > 0 ? data.slice(-14).map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(item.sessions / maxSessions) * 120}px`,
                    minHeight: '4px'
                  }}
                  title={`Sessions: ${item.sessions}`}
                ></div>
                <div 
                  className="w-full bg-green-500 rounded-t"
                  style={{ 
                    height: `${(item.visitors / maxVisitors) * 120}px`,
                    minHeight: '4px'
                  }}
                  title={`Visitors: ${item.visitors}`}
                ></div>
              </div>
              <div className={`text-xs mt-2 transform -rotate-45 origin-left ${
                mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.date}
              </div>
            </div>
          )) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className={`text-sm ${
                mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className={`text-sm ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Sessions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className={`text-sm ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Visitors</span>
        </div>
      </div>
    </div>
  );
}
