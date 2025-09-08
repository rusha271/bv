"use client";

import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleTheme } = useThemeContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-md transition-colors ${
          mode === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-900'
        }`}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Theme toggle button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <div className={`p-2 rounded-md shadow-md ${
          mode === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-100'
        }`}>
          <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:static
        inset-y-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header with theme toggle */}
        <header className={`hidden lg:flex items-center justify-between px-6 py-4 border-b ${
          mode === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div>
            <h1 className={`text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
          </div>
        </header>

        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-8 lg:ml-0 ${
          mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          {/* Mobile header spacing */}
          <div className="lg:hidden h-16"></div>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
