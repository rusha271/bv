"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Globe,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { mode } = useThemeContext();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Visitors", href: "/dashboard/visitors", icon: Users },
    { name: "Consultations", href: "/dashboard/consultations", icon: MessageSquare },
    // { name: "World Map", href: "/dashboard/world-map", icon: Globe },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Site Settings", href: "/dashboard/site-settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-72'} shadow-2xl h-full backdrop-blur-xl border-r transition-all duration-500 ease-out ${
      mode === 'dark' 
        ? 'bg-slate-800/90 border-slate-700/50' 
        : 'bg-white/90 border-slate-200/50'
    }`}>
      {/* Header */}
      <div className={`${collapsed ? 'p-4' : 'p-8'} border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-out`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {!collapsed && (
              <div className="transition-all duration-500 ease-out">
                <h1 className={`text-xl font-bold bg-gradient-to-r ${
                  mode === 'dark' 
                    ? 'from-white via-emerald-200 to-purple-200' 
                    : 'from-gray-900 via-emerald-800 to-purple-800'
                } bg-clip-text text-transparent`}>
                  Admin Panel
                </h1>
                <p className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'} transition-colors duration-300`}>
                  Control Center
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse button - always visible on desktop */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 ${
                mode === 'dark' 
                  ? 'hover:bg-slate-700/50 text-slate-300 hover:text-emerald-300' 
                  : 'hover:bg-slate-100/50 text-slate-600 hover:text-emerald-600'
              }`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5 transition-transform duration-300" /> : <ChevronLeft className="h-5 w-5 transition-transform duration-300" />}
            </button>
            {/* Close button - visible only on mobile */}
            <button
              onClick={onClose}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                mode === 'dark' 
                  ? 'hover:bg-slate-700/50 text-slate-300' 
                  : 'hover:bg-slate-100/50 text-slate-600'
              }`}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`mt-8 ${collapsed ? 'px-2' : 'px-4'} transition-all duration-500 ease-out`}>
        <div className="space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`group relative flex items-center ${collapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} text-sm font-medium rounded-2xl transition-all duration-300 ease-out ${
                  isActive
                    ? mode === 'dark'
                      ? "bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 text-emerald-300 border border-emerald-500/30 shadow-xl shadow-emerald-500/10"
                      : "bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 text-emerald-700 border border-emerald-200 shadow-xl shadow-emerald-500/10"
                    : mode === 'dark'
                      ? "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-2 hover:shadow-lg"
                      : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 hover:translate-x-2 hover:shadow-lg"
                }`}
                title={collapsed ? item.name : undefined}
              >
                {/* Animated background overlay */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? mode === 'dark'
                      ? "bg-gradient-to-r from-emerald-500/10 to-purple-500/10"
                      : "bg-gradient-to-r from-emerald-500/5 to-purple-500/5"
                    : "bg-gradient-to-r from-emerald-500/0 to-purple-500/0 group-hover:from-emerald-500/5 group-hover:to-purple-500/5"
                }`} />
                
                <div className={`relative p-2 rounded-xl ${collapsed ? '' : 'mr-3'} transition-all duration-300 ${
                  isActive
                    ? mode === 'dark'
                      ? "bg-emerald-500/20 text-emerald-300 shadow-lg"
                      : "bg-emerald-100 text-emerald-600 shadow-lg"
                    : mode === 'dark'
                      ? "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-200 group-hover:scale-110"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 group-hover:scale-110"
                }`}>
                  <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                {!collapsed && (
                  <>
                    <span className="font-medium relative z-10 transition-all duration-300">{item.name}</span>
                    {isActive && (
                      <div className={`ml-auto w-2 h-2 rounded-full animate-pulse ${
                        mode === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'
                      }`} />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-out">
          <div className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
            mode === 'dark' 
              ? 'bg-gradient-to-r from-slate-700/30 to-slate-600/30 border border-slate-600/30 hover:shadow-lg' 
              : 'bg-gradient-to-r from-slate-100/50 to-slate-200/50 border border-slate-200/50 hover:shadow-lg'
          }`}>
            <div className={`text-xs font-medium ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Version 2.0
            </div>
            <div className={`text-xs ${
              mode === 'dark' ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Modern Dashboard
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
