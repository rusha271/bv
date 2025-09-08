"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import StatsCards from "@/components/ui/admin-dashboard/StatsCards";
import OrganicSessionsChart from "@/components/ui/admin-dashboard/OrganicSessionsChart";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function DashboardPage() {
  const { mode } = useThemeContext();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center lg:text-left">
          <h1 className={`text-3xl font-bold mb-3 ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard Overview
          </h1>
          <p className={`text-lg ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Monitor your website analytics and visitor insights
          </p>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <OrganicSessionsChart />
          <WorldMapVisitors />
        </div>
      </div>
    </DashboardLayout>
  );
}
