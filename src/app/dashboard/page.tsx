"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import StatsCards from "@/components/ui/admin-dashboard/StatsCards";
import OrganicSessionsChart from "@/components/ui/admin-dashboard/OrganicSessionsChart";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your website analytics and visitor insights</p>
        </div>
        
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrganicSessionsChart />
          <WorldMapVisitors />
        </div>
      </div>
    </DashboardLayout>
  );
}
