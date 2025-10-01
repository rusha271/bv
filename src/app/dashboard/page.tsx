"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import StatsCards from "@/components/ui/admin-dashboard/StatsCards";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";
import { Sparkles, TrendingUp, Users, Globe } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import to prevent hydration issues
const OrganicSessionsChart = dynamic(
  () => import("@/components/ui/admin-dashboard/OrganicSessionsChart"),
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-xl shadow-lg p-6 border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 rounded w-1/3 mb-4 bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    )
  }
);

export default function DashboardPage() {
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();

  return (
    <DashboardLayout>
      <div className={`min-h-screen transition-all duration-150 ease-out ${
        mode === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
        <div className="container mx-auto px-6 py-8">
          {/* Modern Header Section */}
          <div className="text-center lg:text-left mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 mb-6 shadow-lg lg:hidden">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              Dashboard Overview
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Monitor your website analytics and visitor insights with real-time data
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="mb-12">
            <StatsCards />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="group">
              <OrganicSessionsChart />
            </div>
            <div className="group">
              <WorldMapVisitors />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
