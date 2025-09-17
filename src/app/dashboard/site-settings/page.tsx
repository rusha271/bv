"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { Settings, Image as ImageIcon, ArrowRight, Upload, FileText, Video, Palette } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function SiteSettingsPage() {
  const { mode } = useThemeContext();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Modern Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Site Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Streamline your site management with our intuitive file and content tools
            </p>
          </div>

          {/* Modern Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* File Management Card */}
            <Link href="/dashboard/site-settings/image-upload">
              <div className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    File Management
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Upload and manage your site files including logos, tour videos, and other assets with our advanced file management system.
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Logo & branding files</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tour video uploads</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Site assets & files</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">File history & management</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon Cards */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl opacity-75">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-slate-500/5 to-gray-500/10" />
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                    Coming Soon
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Content Manager
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Advanced content management system for blogs, articles, and dynamic content.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Rich text editor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Media library</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">SEO optimization</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl opacity-75">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-slate-500/5 to-gray-500/10" />
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg flex items-center justify-center">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                    Coming Soon
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Theme Customizer
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Customize your site's appearance with our advanced theme editor and color schemes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Color schemes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Layout options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Live preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">File Management</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">HD</div>
                <div className="text-gray-600 dark:text-gray-300">Video Support</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100MB</div>
                <div className="text-gray-600 dark:text-gray-300">Max Upload Size</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
