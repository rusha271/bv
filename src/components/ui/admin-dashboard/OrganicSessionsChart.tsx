"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp } from "lucide-react";


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
  const [data, setData] = useState(generateDummyData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionsData = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setError(null);
        
        // In a real implementation, you would fetch from your analytics API
        // const response = await fetch('/api/analytics/sessions');
        // const sessionsData = await response.json();
        
        // For now, we'll use dummy data
        setData(generateDummyData());
      } catch (err) {
        console.error('Error fetching sessions data:', err);
        setError('Failed to load sessions data');
        // Keep using dummy data as fallback
      }
    };

    fetchSessionsData();
  }, []);

  // Simple chart data display without Recharts
  const maxSessions = Math.max(...data.map(d => d.sessions));
  const maxVisitors = Math.max(...data.map(d => d.visitors));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Visitor Sessions</h3>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </div>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">+15%</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="h-64 p-4">
        <div className="h-full flex items-end justify-between space-x-1">
          {data.slice(-14).map((item, index) => (
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
              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Sessions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Visitors</span>
        </div>
      </div>
    </div>
  );
}
