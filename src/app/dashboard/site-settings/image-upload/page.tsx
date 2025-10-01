"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, Download, Eye, FileText, Video, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService, SiteSetting } from "@/utils/apiService";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";

type Category = 'logo' | 'tour_video' | 'chakra_points';

interface FileValidation {
  allowedTypes: string[];
  maxSize: number; // in MB
  maxSizeText: string;
}

const FILE_VALIDATIONS: Record<Category, FileValidation> = {
  logo: {
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
    maxSize: 5,
    maxSizeText: '5MB'
  },
  tour_video: {
    allowedTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'],
    maxSize: 100,
    maxSizeText: '100MB'
  },
  chakra_points: {
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
    maxSize: 10,
    maxSizeText: '10MB'
  }
};

export default function SiteSettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('logo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [currentFiles, setCurrentFiles] = useState<Record<Category, SiteSetting | null>>({
    logo: null,
    tour_video: null,
    chakra_points: null
  });
  const [currentFileUrls, setCurrentFileUrls] = useState<Record<Category, string | null>>({
    logo: null,
    tour_video: null,
    chakra_points: null
  });
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();

  // Fetch current files on page load
  useEffect(() => {
    fetchCurrentFiles();
    fetchAllSiteSettings();
  }, []);

  const fetchCurrentFiles = async () => {
    try {
      setIsLoading(true);
      
      // Optimized API call to get all latest site settings using existing endpoints
      const response = await apiService.siteSettings.getLatestAllOptimized();
      const { data, file_urls } = response;

      setCurrentFiles({
        logo: data.logo,
        tour_video: data.tour_video,
        chakra_points: data.chakra_points
      });
      
      setCurrentFileUrls({
        logo: file_urls.logo,
        tour_video: file_urls.tour_video,
        chakra_points: file_urls.chakra_points
      });
    } catch (error) {
      // console.log('Error fetching current files:', error);
      // Set all to null if there's an error
      setCurrentFiles({
        logo: null,
        tour_video: null,
        chakra_points: null
      });
      setCurrentFileUrls({
        logo: null,
        tour_video: null,
        chakra_points: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSiteSettings = async () => {
    try {
      const data = await apiService.siteSettings.getAll();
      setSiteSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      // console.log('Error fetching site settings:', error);
      setSiteSettings([]); // Ensure it's always an array
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = FILE_VALIDATIONS[selectedCategory];
      
      // Validate file type
      if (!validation.allowedTypes.includes(file.type)) {
        const allowedExtensions = validation.allowedTypes.map(type => {
          if (type.startsWith('image/')) return type.split('/')[1].toUpperCase();
          if (type.startsWith('video/')) return type.split('/')[1].toUpperCase();
          if (type === 'application/pdf') return 'PDF';
          return type;
        }).join(', ');
        
        toast.error(`Please select a valid file (${allowedExtensions})`);
        return;
      }

      // Validate file size
      if (file.size > validation.maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${validation.maxSizeText}`);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      const data = await apiService.siteSettings.upload(selectedCategory, selectedFile);
      
      // Clear the cache to force fresh data fetch
      await apiService.siteSettings.clearCache();
      
      // Update current files
      setCurrentFiles(prev => ({
        ...prev,
        [selectedCategory]: data
      }));
      
      // Refresh all site settings
      await fetchAllSiteSettings();
      
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success(`${selectedCategory.replace('_', ' ')} uploaded successfully!`);
    } catch (error: any) {
      // console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number, category: Category) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await apiService.siteSettings.delete(id);
      
      // Update current files if this was the latest
      if (currentFiles[category]?.id === id) {
        setCurrentFiles(prev => ({
          ...prev,
          [category]: null
        }));
      }
      
      // Refresh all site settings
      await fetchAllSiteSettings();
      
      toast.success('File deleted successfully!');
    } catch (error: any) {
      //  console.error('Delete error:', error);
      toast.error(error.message || 'An error occurred while deleting the file');
    }
  };

  const getFileUrl = (filePath: string | undefined | null, category?: Category) => {
    if (!filePath) {
      return '';
    }
    if (filePath.startsWith('http')) {
      return filePath;
    }
    // Construct the full URL using the same base URL as the apiService
    const baseURL = apiService.getBaseURL();
    return filePath.startsWith('/') ? `${baseURL}${filePath}` : `${baseURL}/${filePath}`;
  };

  const getCurrentFileUrl = (category: Category) => {
    // First try the stored file_url from the API response
    if (currentFileUrls[category]) {
      return getFileUrl(currentFileUrls[category]);
    }
    // Fallback to the file_path from the data
    if (currentFiles[category]?.public_url || currentFiles[category]?.file_path) {
      return getFileUrl(currentFiles[category]?.public_url || currentFiles[category]?.file_path);
    }
    return '';
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'logo':
        return <ImageIcon className="w-5 h-5" />;
      case 'tour_video':
        return <Video className="w-5 h-5" />;
      case 'chakra_points':
        return <Zap className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryDisplayName = (category: Category) => {
    switch (category) {
      case 'logo':
        return 'Logo';
      case 'tour_video':
        return 'Tour Video';
      case 'chakra_points':
        return 'Chakra Points Files';
      default:
        return category;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <Upload className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              File Management
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Manage your site files and assets with modern tools
            </p>
          </div>

          {/* Modern Tab Navigation */}
          <div className={`rounded-2xl backdrop-blur-xl border shadow-xl mb-8 ${
            mode === 'dark' 
              ? 'bg-slate-800/80 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}>
            <div className="p-2">
              <div className="flex space-x-2">
                {(['logo', 'tour_video', 'chakra_points'] as Category[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-1 flex items-center justify-center px-6 py-4 rounded-xl transition-all duration-300 ${
                      selectedCategory === category
                        ? mode === 'dark'
                          ? 'bg-gradient-to-r from-emerald-500/20 to-purple-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg'
                          : 'bg-gradient-to-r from-emerald-50 to-purple-50 text-emerald-700 border border-emerald-200 shadow-lg'
                        : mode === 'dark'
                        ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                      selectedCategory === category
                        ? mode === 'dark'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-emerald-100 text-emerald-600'
                        : mode === 'dark'
                        ? 'bg-slate-700/50 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">
                        {getCategoryDisplayName(category)}
                      </h3>
                      <p className={`text-xs ${
                        mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {FILE_VALIDATIONS[category].maxSizeText} max
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Form - Hidden for chakra-points */}
          {selectedCategory !== 'chakra_points' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <div className={`rounded-2xl backdrop-blur-xl border shadow-xl p-8 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            }`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Upload New {getCategoryDisplayName(selectedCategory)}
                  </h2>
                  <p className={`text-sm ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Select and upload your file
                  </p>
                </div>
              </div>
            
              <div className="space-y-6">
                <div>
                  <label htmlFor="file-upload" className={`block text-sm font-medium mb-3 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Select {getCategoryDisplayName(selectedCategory)} File
                  </label>
                  <div className="relative">
                    <input
                      id="file-upload"
                      type="file"
                      accept={FILE_VALIDATIONS[selectedCategory].allowedTypes.join(',')}
                      onChange={handleFileSelect}
                      className={`block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium border rounded-xl p-3 transition-all duration-300 ${
                        mode === 'dark'
                          ? 'text-gray-300 bg-slate-700/50 border-slate-600 file:bg-gradient-to-r file:from-emerald-500 file:to-emerald-600 file:text-white hover:file:from-emerald-600 hover:file:to-emerald-700'
                          : 'text-gray-500 bg-slate-50 border-slate-300 file:bg-gradient-to-r file:from-emerald-500 file:to-emerald-600 file:text-white hover:file:from-emerald-600 hover:file:to-emerald-700'
                      }`}
                    />
                  </div>
                  <p className={`mt-2 text-xs ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Supported formats: {FILE_VALIDATIONS[selectedCategory].allowedTypes.map(type => {
                      if (type.startsWith('image/')) return type.split('/')[1].toUpperCase();
                      if (type.startsWith('video/')) return type.split('/')[1].toUpperCase();
                      if (type === 'application/pdf') return 'PDF';
                      return type;
                    }).join(', ')}. Max size: {FILE_VALIDATIONS[selectedCategory].maxSizeText}
                  </p>
                </div>

                {selectedFile && (
                  <div className={`border rounded-xl p-4 transition-all duration-300 ${
                    mode === 'dark' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        mode === 'dark' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {getCategoryIcon(selectedCategory)}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          mode === 'dark' ? 'text-emerald-200' : 'text-emerald-800'
                        }`}>
                          {selectedFile.name}
                        </p>
                        <p className={`text-xs ${
                          mode === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                        }`}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-3" />
                      Upload {getCategoryDisplayName(selectedCategory)}
                    </>
                  )}
                </button>
              </div>
          </div>

            {/* Current File Display */}
            <div className={`rounded-2xl backdrop-blur-xl border shadow-xl p-8 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            }`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                  {getCategoryIcon(selectedCategory)}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Current {getCategoryDisplayName(selectedCategory)}
                  </h2>
                  <p className={`text-sm ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Currently uploaded file
                  </p>
                </div>
              </div>
            
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : currentFiles[selectedCategory] ? (
              <div className="space-y-4">
                <div className={`border rounded-md p-4 ${
                  mode === 'dark' 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  {selectedCategory === 'logo' ? (
                    <img
                      src={getCurrentFileUrl(selectedCategory)}
                      alt={`Current ${getCategoryDisplayName(selectedCategory)}`}
                      className="max-h-32 max-w-full object-contain mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : selectedCategory === 'tour_video' ? (
                    <video
                      src={getCurrentFileUrl(selectedCategory)}
                      className="max-h-32 max-w-full object-contain mx-auto"
                      controls
                    />
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                <div className={`flex items-center text-sm ${
                  mode === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                    {getCategoryDisplayName(selectedCategory)} is active
                  </div>
                  <div className={`text-xs ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Uploaded: {currentFiles[selectedCategory]?.created_at ? formatDate(currentFiles[selectedCategory]!.created_at) : 'Unknown'}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={getCurrentFileUrl(selectedCategory)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </a>
                  <a
                    href={getCurrentFileUrl(selectedCategory)}
                    download
                    className="flex items-center px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </a>
                  <button
                    onClick={() => currentFiles[selectedCategory]?.id && handleDelete(currentFiles[selectedCategory]!.id, selectedCategory)}
                    className="flex items-center px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${
                  mode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  No {getCategoryDisplayName(selectedCategory).toLowerCase()} uploaded yet
                </p>
                <p className={`text-sm mt-1 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  Upload a {getCategoryDisplayName(selectedCategory).toLowerCase()} to get started
                </p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Chakra Points Management */}
        {selectedCategory === 'chakra_points' && (
          <div className={`rounded-xl shadow-lg p-6 border ${
            mode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-4 flex items-center ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Zap className="w-5 h-5 mr-2" />
              Chakra Points Management
            </h2>
            <p className={`text-sm mb-4 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Each chakra point (N1, N2, E1, E2, etc.) can have its own image. Some points may have images while others may not.
            </p>
            <a
              href="/dashboard/site-settings/chakra-points"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Manage Individual Chakra Points
            </a>
          </div>
        )}

        {/* File History */}
        <div className={`rounded-xl shadow-lg p-6 border ${
          mode === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <FileText className="w-5 h-5 mr-2" />
            {getCategoryDisplayName(selectedCategory)} History
          </h2>
          
          {Array.isArray(siteSettings) && siteSettings.filter(setting => setting.category === selectedCategory).length > 0 ? (
            <div className="space-y-3">
              {siteSettings
                .filter(setting => setting.category === selectedCategory)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((setting) => (
                  <div
                    key={setting.id}
                    className={`border rounded-md p-3 ${
                      mode === 'dark' 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(selectedCategory)}
                        <div>
                          <p className={`text-sm font-medium ${
                            mode === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {setting.file_path.split('/').pop()}
                          </p>
                          <p className={`text-xs ${
                            mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Uploaded: {formatDate(setting.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {setting.id === currentFiles[selectedCategory]?.id && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            mode === 'dark' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            Active
                          </span>
                        )}
                        <a
                          href={getFileUrl(setting.public_url || setting.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={getFileUrl(setting.public_url || setting.file_path)}
                          download
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(setting.id, selectedCategory)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className={`w-12 h-12 mx-auto mb-3 ${
                mode === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <p className={`${
                mode === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {selectedCategory === 'chakra_points'
                  ? 'No chakra point images uploaded yet'
                  : `No ${getCategoryDisplayName(selectedCategory).toLowerCase()} files uploaded yet`
                }
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
