"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { Plus, Edit, Delete, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "@/utils/apiService";
import { useThemeContext } from "@/contexts/ThemeContext";
import ChakraForm from "@/components/Admin/ChakraForm";
import { ChakraPoint, ChakraPointForm, convertBackendToFrontend, convertFrontendToBackend } from "@/types/chakra";

export default function ChakraPointsPage() {
  const [chakraPoints, setChakraPoints] = useState<{ [key: string]: ChakraPoint }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChakra, setEditingChakra] = useState<ChakraPoint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPoints, setFilteredPoints] = useState<ChakraPoint[]>([]);
  const { mode } = useThemeContext();

  // Clear any duplicate data from local storage on component mount
  useEffect(() => {
    try {
      const localData = localStorage.getItem('chakra_points');
      if (localData) {
        const parsedData = JSON.parse(localData);
        const deduplicatedData = deduplicateChakraPoints(parsedData);
        // Only update if there were duplicates
        if (Object.keys(parsedData).length !== Object.keys(deduplicatedData).length) {
          localStorage.setItem('chakra_points', JSON.stringify(deduplicatedData));
          // console.log('Cleaned up duplicate chakra points in local storage');
        }
      }
    } catch (error) {
      // console.error('Error cleaning up local storage:', error);
    }
  }, []);

  // Fetch chakra points on component mount
  useEffect(() => {
    fetchChakraPoints();
  }, []);

  // Filter chakra points based on search term
  useEffect(() => {
    const points = Object.values(chakraPoints);
    if (searchTerm) {
      const filtered = points.filter(point =>
        point.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.direction.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPoints(filtered);
    } else {
      setFilteredPoints(points);
    }
  }, [chakraPoints, searchTerm]);

  // Helper function to deduplicate chakra points
  const deduplicateChakraPoints = (points: { [key: string]: any }) => {
    const uniquePoints: { [key: string]: any } = {};
    const seenIds = new Set<string>();
    
    Object.values(points).forEach((point: any) => {
      if (point && point.id && !seenIds.has(point.id)) {
        seenIds.add(point.id);
        uniquePoints[point.id] = point;
      }
    });
    
    return uniquePoints;
  };

  const fetchChakraPoints = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.vastuChakraPoints.getChakraPoints();
      if (data && typeof data === 'object') {
        const deduplicatedData = deduplicateChakraPoints(data);
        // console.log('Loaded chakra points from API:', Object.keys(deduplicatedData).length, 'points');
        setChakraPoints(deduplicatedData);
      }
    } catch (error) {
      // console.log('API failed, checking local storage fallback:', error);
      
      // Fallback: Try to load from local storage
      try {
        const localData = localStorage.getItem('chakra_points');
        if (localData) {
          const parsedData = JSON.parse(localData);
          const deduplicatedData = deduplicateChakraPoints(parsedData);
          // console.log('Loaded chakra points from local storage:', Object.keys(deduplicatedData).length, 'points');
          setChakraPoints(deduplicatedData);
        } else {
          // No data available - show empty state
          // console.log('No chakra points data available');
          setChakraPoints({});
        }
      } catch (localError) {
        // console.error('Local storage fallback failed:', localError);
        setChakraPoints({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingChakra(null);
    setShowForm(true);
  };

  const handleEdit = (chakraPoint: ChakraPoint) => {
    setEditingChakra(chakraPoint);
    setShowForm(true);
  };

  const handleDelete = async (chakraId: string) => {
    if (window.confirm('Are you sure you want to delete this chakra point?')) {
      try {
        await apiService.vastuChakraPoints.deleteChakraPoint(chakraId);
        const updatedPoints = { ...chakraPoints };
        delete updatedPoints[chakraId];
        setChakraPoints(updatedPoints);
        toast.success('Chakra point deleted successfully!');
      } catch (error: any) {
        // console.error('Error deleting chakra point:', error);
        
        // Check if this is a network/API error and use local storage fallback
        const isNetworkError = error?.status === 0 || 
                             error?.message?.includes('Network error') ||
                             error?.message?.includes('fetch') ||
                             error?.code === 'ECONNABORTED' ||
                             !error?.response;
        
        if (isNetworkError) {
          //  console.log('API unavailable, deleting from local storage');
          try {
            const localData = localStorage.getItem('chakra_points');
            if (localData) {
              const localPoints = JSON.parse(localData);
              delete localPoints[chakraId];
              localStorage.setItem('chakra_points', JSON.stringify(localPoints));
            }
            
            const updatedPoints = { ...chakraPoints };
            delete updatedPoints[chakraId];
            setChakraPoints(updatedPoints);
            toast.success('Chakra point deleted from local storage!');
          } catch (localError) {
            // console.error('Local storage delete failed:', localError);
            toast.error('Failed to delete chakra point');
          }
        } else {
          toast.error(error.message || 'Failed to delete chakra point');
        }
      }
    }
  };

  const handleFormSave = (chakraPoint: ChakraPoint) => {
    setChakraPoints(prev => {
      const updated = {
        ...prev,
        [chakraPoint.id]: chakraPoint
      };
      // Ensure no duplicates by deduplicating
      const deduplicated = deduplicateChakraPoints(updated);
      // console.log('Saved chakra point:', chakraPoint.id, 'Total points:', Object.keys(deduplicated).length);
      return deduplicated;
    });
    setShowForm(false);
    setEditingChakra(null);
    toast.success(editingChakra ? 'Chakra point updated successfully!' : 'Chakra point created successfully!');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingChakra(null);
  };

  const getStatusColor = (point: ChakraPoint) => {
    if (point.should_avoid) return 'bg-red-100 text-red-800 border-red-200';
    if (point.is_auspicious) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (point: ChakraPoint) => {
    if (point.should_avoid) return 'Avoid';
    if (point.is_auspicious) return 'Auspicious';
    return 'Neutral';
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className={`text-3xl font-bold mb-3 ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {editingChakra ? 'Edit Chakra Point' : 'Create New Chakra Point'}
            </h1>
            <p className={`text-lg ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {editingChakra ? 'Update chakra point information' : 'Add a new chakra point to the system'}
            </p>
          </div>

          <ChakraForm
            chakraPoint={editingChakra}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            isEditing={!!editingChakra}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center lg:text-left">
          <h1 className={`text-3xl font-bold mb-3 ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Chakra Points Management
          </h1>
          <p className={`text-lg ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage all chakra points and their properties
          </p>
        </div>

        {/* Search and Add Button */}
        <div className={`rounded-xl shadow-lg p-6 border ${
          mode === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search chakra points..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Chakra Point
            </button>
          </div>
        </div>

        {/* Chakra Points Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPoints.map((point, index) => (
              <div
                key={`${point.id}-${index}`}
                className={`rounded-xl shadow-lg p-6 border transition-all duration-200 hover:shadow-xl ${
                  mode === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-bold ${
                      mode === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {point.id}
                    </h3>
                    <p className={`text-sm ${
                      mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {point.name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(point)}
                      className={`p-2 rounded-md transition-colors ${
                        mode === 'dark'
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(point.id)}
                      className={`p-2 rounded-md transition-colors ${
                        mode === 'dark'
                          ? 'hover:bg-red-900 text-gray-300 hover:text-red-400'
                          : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                      }`}
                      title="Delete"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(point)}`}>
                    {getStatusText(point)}
                  </span>
                </div>

                {/* Direction */}
                <p className={`text-sm mb-3 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {point.direction}
                </p>

                {/* Image Display */}
                {point.image_url && (
                  <div className="mb-3">
                    <img
                      src={point.image_url}
                      alt={`${point.name} chakra point`}
                      className="w-full h-24 object-cover rounded-md"
                      style={{ maxHeight: '96px' }}
                    />
                  </div>
                )}

                {/* Description Preview */}
                <p className={`text-xs line-clamp-3 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {point.description}
                </p>

                {/* Remedies Preview */}
                {point.remedies && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-xs font-medium mb-1 ${
                      mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Remedies:
                    </p>
                    <p className={`text-xs line-clamp-2 ${
                      mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {point.remedies}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPoints.length === 0 && (
          <div className={`text-center py-12 ${
            mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No chakra points found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first chakra point'
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
