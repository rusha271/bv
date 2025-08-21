"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";

export default function WorldMapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Visitor Distribution</h1>
          <p className="text-gray-600">Interactive world map showing visitor locations and analytics</p>
        </div>
        
        <WorldMapVisitors />
      </div>
    </DashboardLayout>
  );
} 