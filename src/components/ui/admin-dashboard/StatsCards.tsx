"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

interface StatsData {
  totalVisitors: number;
  consultationRequests: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData>({ totalVisitors: 0, consultationRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useThemeContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setError(null);

        // Fetch visitors data
        const visitorsResponse = await fetch('/api/analytics/visitors');
        const visitorsData = visitorsResponse.ok 
          ? await visitorsResponse.json() 
          : { totalVisitors: 0 };

        // Fetch consultation requests data
        const consultationsResponse = await fetch('http://localhost:8000/api/contact/consultation/simple');
        const consultationsData = consultationsResponse.ok 
          ? await consultationsResponse.json() 
          : { count: 0 };

        setStats({
          totalVisitors: visitorsData.totalVisitors || 0,
          consultationRequests: consultationsData.count || consultationsData.length || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
        // Fallback to dummy data
        setStats({
          totalVisitors: 1250,
          consultationRequests: 89
        });
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Visitors",
      value: stats.totalVisitors.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
      iconBgDark: "bg-purple-900",
      changeColor: "text-green-500",
      timeframe: "Last 4 Month"
    },
    {
      title: "Consultation Requests",
      value: stats.consultationRequests.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: MessageSquare,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      iconBgDark: "bg-green-900",
      changeColor: "text-green-500",
      timeframe: "Last Six Month"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className={`rounded-xl shadow-lg p-6 border animate-pulse ${
            mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`w-16 h-4 rounded ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="space-y-2">
              <div className={`h-10 rounded w-1/3 ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded w-1/2 ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="mt-4">
              <div className={`w-20 h-6 rounded-full ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {error && (
        <div className={`col-span-full rounded-lg p-4 mb-4 ${
          mode === 'dark' 
            ? 'bg-red-900 border border-red-700' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            mode === 'dark' ? 'text-red-300' : 'text-red-600'
          }`}>{error}</p>
        </div>
      )}
      
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-xl shadow-lg p-6 border ${
          mode === 'dark' 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
        } transition-all duration-200`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              mode === 'dark' ? card.iconBgDark : card.iconBg
            }`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className="flex items-center">
              {card.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-semibold ${card.changeColor}`}>
                {card.change}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className={`text-4xl font-bold ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{card.value}</p>
            <p className={`text-sm font-medium ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>{card.title}</p>
          </div>
          
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              mode === 'dark' 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {card.timeframe}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
