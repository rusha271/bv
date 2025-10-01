"use client";

import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mode, toggleTheme, isDarkMode, isLightMode } = useGlobalTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`flex h-screen ${mode === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-6 left-6 z-50 p-3 rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
          mode === 'dark' 
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/50' 
            : 'bg-white/80 hover:bg-white text-gray-900 border border-white/50'
        }`}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Theme toggle button */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <div className={`p-3 rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
          mode === 'dark' 
            ? 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50' 
            : 'bg-white/80 hover:bg-white border border-white/50'
        }`}>
          <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0 z-50
        transition-all duration-500 ease-out
        lg:transition-all lg:duration-300 lg:ease-out
      `}>
        <Sidebar 
          onClose={closeSidebar} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header with theme toggle */}
        <header className={`hidden lg:flex items-center justify-between px-8 py-6 border-b backdrop-blur-xl ${
          mode === 'dark' 
            ? 'bg-slate-800/80 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                mode === 'dark' 
                  ? 'from-white via-emerald-200 to-purple-200' 
                  : 'from-gray-900 via-emerald-800 to-purple-800'
              } bg-clip-text text-transparent`}>
                Admin Dashboard
              </h1>
              <p className={`text-sm ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Manage your site with ease
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-xl ${
              mode === 'dark' 
                ? 'bg-slate-700/50 border border-slate-600/50' 
                : 'bg-slate-100/50 border border-slate-200/50'
            }`}>
              <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-out ${
          mode === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          {/* Mobile header spacing */}
          <div className="lg:hidden h-20"></div>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
