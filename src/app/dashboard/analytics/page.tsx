"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import StatsCards from "@/components/ui/admin-dashboard/StatsCards";
import OrganicSessionsChart from "@/components/ui/admin-dashboard/OrganicSessionsChart";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and performance metrics</p>
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