"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import StatsCards from "@/components/ui/admin-dashboard/StatsCards";
import OrganicSessionsChart from "@/components/ui/admin-dashboard/OrganicSessionsChart";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";
import { BarChart3, TrendingUp, Activity, Target } from "lucide-react";

export default function AnalyticsPage() {
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();

  return (
    <DashboardLayout>
      <div className={`min-h-screen transition-all duration-300 ${
        mode === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
        <div className="container mx-auto px-6 py-8">
          {/* Modern Header Section */}
          <div className="text-center lg:text-left mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 mb-6 shadow-lg lg:hidden">
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              Analytics Dashboard
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Comprehensive analytics and performance metrics with real-time insights
            </p>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Bounce Rate</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>24.5%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500 font-medium">-2.1%</span>
                <span className={`text-sm ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Avg. Session</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>3m 42s</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500 font-medium">+12.3%</span>
                <span className={`text-sm ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Conversion</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>8.7%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500 font-medium">+5.8%</span>
                <span className={`text-sm ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Page Load</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>1.2s</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500 font-medium">-15.2%</span>
                <span className={`text-sm ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="mb-12">
            <StatsCards />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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