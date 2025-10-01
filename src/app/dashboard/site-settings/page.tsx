"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { Settings, Image as ImageIcon, ArrowRight, Upload, FileText, Video, Palette } from "lucide-react";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";
import Link from "next/link";

export default function SiteSettingsPage() {
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-blue-200 to-purple-200' 
                : 'from-gray-900 via-blue-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              Site Settings
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto leading-relaxed`}>
              Streamline your site management with our intuitive file and content tools
            </p>
          </div>

          {/* Modern Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* File Management Card */}
            <Link href="/dashboard/site-settings/image-upload">
              <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-200 ease-out hover:-translate-y-2 cursor-pointer ${
                mode === 'dark' 
                  ? 'bg-slate-800/80 border-slate-700/50' 
                  : 'bg-white/80 border-white/20'
              }`}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out" />
                
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
                  <h3 className={`text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300 ${
                    mode === 'dark' 
                      ? 'text-white group-hover:text-blue-400' 
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    File Management
                  </h3>
                  
                  {/* Description */}
                  <p className={`mb-6 leading-relaxed ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Upload and manage your site files including logos, tour videos, and other assets with our advanced file management system.
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className={`text-sm ${
                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Logo & branding files</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className={`text-sm ${
                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Tour video uploads</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span className={`text-sm ${
                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Site assets & files</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className={`text-sm ${
                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>File history & management</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon Cards */}
            <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-xl opacity-75 ${
              mode === 'dark' 
                ? 'bg-slate-800/60 border-slate-700/50' 
                : 'bg-white/60 border-white/20'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-slate-500/5 to-gray-500/10" />
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mode === 'dark' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    Coming Soon
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Content Manager
                </h3>
                <p className={`mb-6 leading-relaxed ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Advanced content management system for blogs, articles, and dynamic content.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Rich text editor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Media library</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>SEO optimization</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-xl opacity-75 ${
              mode === 'dark' 
                ? 'bg-slate-800/60 border-slate-700/50' 
                : 'bg-white/60 border-white/20'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-slate-500/5 to-gray-500/10" />
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg flex items-center justify-center">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mode === 'dark' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    Coming Soon
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Theme Customizer
                </h3>
                <p className={`mb-6 leading-relaxed ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Customize your site's appearance with our advanced theme editor and color schemes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Color schemes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Layout options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className={`text-sm ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Live preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`text-center p-6 rounded-2xl backdrop-blur-xl border shadow-lg ${
                mode === 'dark' 
                  ? 'bg-slate-800/80 border-slate-700/50' 
                  : 'bg-white/80 border-white/20'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>24/7</div>
                <div className={`${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>File Management</div>
              </div>
              
              <div className={`text-center p-6 rounded-2xl backdrop-blur-xl border shadow-lg ${
                mode === 'dark' 
                  ? 'bg-slate-800/80 border-slate-700/50' 
                  : 'bg-white/80 border-white/20'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>HD</div>
                <div className={`${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Video Support</div>
              </div>
              
              <div className={`text-center p-6 rounded-2xl backdrop-blur-xl border shadow-lg ${
                mode === 'dark' 
                  ? 'bg-slate-800/80 border-slate-700/50' 
                  : 'bg-white/80 border-white/20'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${
                  mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>100MB</div>
                <div className={`${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Max Upload Size</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
