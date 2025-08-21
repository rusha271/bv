"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import OrganicSessionsChart from "@/components/ui/admin-dashboard/OrganicSessionsChart";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";

export default function VisitorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visitor Analytics</h1>
          <p className="text-gray-600">Detailed visitor insights and behavior analysis</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrganicSessionsChart />
          <WorldMapVisitors />
        </div>
      </div>
    </DashboardLayout>
  );
} 