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
  X
} from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { mode } = useThemeContext();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Visitors", href: "/dashboard/visitors", icon: Users },
    { name: "Consultations", href: "/dashboard/consultations", icon: MessageSquare },
    { name: "World Map", href: "/dashboard/world-map", icon: Globe },
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
    <div className={`w-64 shadow-lg h-full ${
      mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Panel
          </h1>
          {/* Close button - visible only on mobile */}
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-md transition-colors ${
              mode === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  isActive
                    ? mode === 'dark'
                      ? "bg-blue-900 text-blue-300 border-r-2 border-blue-300"
                      : "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : mode === 'dark'
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
