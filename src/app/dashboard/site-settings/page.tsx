"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "@/utils/apiService";

export default function SiteSettingsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current logo on page load
  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  const fetchCurrentLogo = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.admin.getLogo();
      setCurrentLogo(data.image_url);
    } catch (error) {
      console.log('No current logo found or error fetching logo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadedLogo(null); // Clear previous upload preview
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      const data = await apiService.admin.uploadLogo(selectedFile);
      setUploadedLogo(data.image_url);
      setCurrentLogo(data.image_url); // Update current logo
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred while uploading the logo');
    } finally {
      setIsUploading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If the path doesn't start with http, it's likely a relative path from the API
    // We need to construct the full URL using the same base URL as the apiService
    const baseURL = apiService.getBaseURL();
    return imagePath.startsWith('/') ? `${baseURL}${imagePath}` : `${baseURL}/${imagePath}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Settings</h1>
          <p className="text-gray-600">Manage your site logo and branding</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload New Logo
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Logo Image
                </label>
                <div className="relative">
                  <input
                    id="logo-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-2"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PNG, JPG, JPEG. Max size: 5MB
                </p>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center">
                    <ImageIcon className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Logo Display */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Current Logo
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : currentLogo ? (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <img
                    src={getImageUrl(currentLogo)}
                    alt="Current Logo"
                    className="max-h-32 max-w-full object-contain mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Logo is active and displayed on the site
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No logo uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload a logo to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Preview */}
        {uploadedLogo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Upload Preview
            </h2>
            <div className="border border-green-200 rounded-md p-4 bg-green-50">
              <img
                src={getImageUrl(uploadedLogo)}
                alt="Uploaded Logo Preview"
                className="max-h-32 max-w-full object-contain mx-auto"
              />
            </div>
            <p className="text-sm text-green-600 mt-2 text-center">
              This logo is now active and will be displayed on your site
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
