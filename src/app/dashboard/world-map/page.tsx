"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import WorldMapVisitors from "@/components/ui/admin-dashboard/WorldMapVisitors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Globe, Users, TrendingUp, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorldMapPage() {
  const { mode } = useThemeContext();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="container mx-auto px-6 py-6 max-h-screen overflow-y-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/dashboard"
              className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                mode === 'dark' 
                  ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white' 
                  : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          {/* Modern Header Section */}
          <div className="text-center lg:text-left mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 mb-4 shadow-lg lg:hidden">
              <Globe className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-2`}>
              Global Visitor Distribution
            </h1>
            <p className={`text-base ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Interactive world map showing visitor locations and comprehensive analytics
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Countries</p>
                  <p className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>127</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-500 font-medium">+3.1%</span>
                <span className={`text-xs ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>

            <div className={`rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Top Country</p>
                  <p className={`text-lg font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>United States</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Users className="w-3 h-3 text-blue-500 mr-1" />
                <span className="text-xs text-blue-500 font-medium">2,847</span>
                <span className={`text-xs ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>visitors</span>
              </div>
            </div>

            <div className={`rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Europe</p>
                  <p className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>4,231</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-500 font-medium">+5.2%</span>
                <span className={`text-xs ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>

            <div className={`rounded-2xl p-4 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
        <div>
                  <p className={`text-xs font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Asia Pacific</p>
                  <p className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>3,892</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-500 font-medium">+7.8%</span>
                <span className={`text-xs ml-2 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>vs last month</span>
              </div>
            </div>
        </div>
        
          {/* World Map */}
          <div className="group">
        <WorldMapVisitors />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 