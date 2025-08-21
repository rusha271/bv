"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

interface StatsData {
  totalVisitors: number;
  consultationRequests: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData>({ totalVisitors: 0, consultationRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Consultation Requests",
      value: stats.consultationRequests.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: MessageSquare,
      color: "bg-green-500",
      textColor: "text-green-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {error && (
        <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              <div className="flex items-center mt-2">
                {card.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
