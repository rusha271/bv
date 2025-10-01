'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress, 
  Alert, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  Download, 
  Search, 
  FilterList, 
  Sort,
  Person,
  CalendarToday,
  Assessment,
  Star,
  TrendingUp,
  Image as ImageIcon,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import { apiService } from '@/utils/apiService';
import { FloorPlanAnalysis } from '@/utils/apiService';
import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";
import { Image } from "lucide-react";

export default function FloorPlanAnalysesPage() {
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();
  const [analyses, setAnalyses] = useState<FloorPlanAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<FloorPlanAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [analyses, searchTerm, statusFilter, sortBy]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const data = await apiService.floorplan.getAnalyses();
      setAnalyses(data);
      setError(null);
    } catch (err) {
      // console.error('Error fetching floor plan analyses:', err);
      setError('Failed to fetch floor plan analyses');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(analysis => 
        analysis.id.toString().includes(searchTerm) ||
        analysis.user_id.toString().includes(searchTerm) ||
        analysis.file_id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(analysis => analysis.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'user_id':
          return a.user_id - b.user_id;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredAnalyses(filtered);
  };

  const handleViewImage = (analysis: FloorPlanAnalysis) => {
    const imageUrl = analysis.original_image_url || analysis.cropped_image_url || analysis.image_data;
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setOpenDialog(true);
    }
  };

  const handleDownloadImage = (analysis: FloorPlanAnalysis) => {
    const imageUrl = analysis.original_image_url || analysis.cropped_image_url || analysis.image_data;
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `floorplan-analysis-${analysis.id}.png`;
      link.click();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Star sx={{ fontSize: 16 }} />;
      case 'pending':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'failed':
        return <Assessment sx={{ fontSize: 16 }} />;
      default:
        return <ImageIcon sx={{ fontSize: 16 }} />;
    }
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

  const getVastuScoreColor = (score: number | null) => {
    if (!score) return 'default';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getImageUrl = (analysis: FloorPlanAnalysis) => {
    return analysis.original_image_url || analysis.cropped_image_url || analysis.image_data;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${
          mode === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        }`}>
          <div className="text-center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading floor plan analyses...
            </Typography>
            <LinearProgress sx={{ width: '200px', mt: 2 }} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${
          mode === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        }`}>
          <div className="max-w-md mx-auto p-6">
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '1.1rem'
                }
              }}
            >
              {error}
            </Alert>
            <Button 
              variant="contained" 
              onClick={fetchAnalyses}
              startIcon={<Refresh />}
              sx={{ borderRadius: 2 }}
              fullWidth
            >
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <Image className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              Floor Plan Analyses
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Advanced Vastu Analysis Dashboard - View and manage floor plan analyses uploaded by users
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Analyses</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{analyses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completed</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{analyses.filter(a => a.status === 'completed').length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Pending</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{analyses.filter(a => a.status === 'pending').length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Unique Users</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{new Set(analyses.map(a => a.user_id)).size}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Person className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          {/* Filters and Search */}
          <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 mb-8 ${
            mode === 'dark' 
              ? 'bg-slate-800/80 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          } shadow-xl`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, User ID, or File ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                    mode === 'dark'
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterList className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 appearance-none ${
                    mode === 'dark'
                      ? 'bg-slate-700/50 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sort className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 appearance-none ${
                    mode === 'dark'
                      ? 'bg-slate-700/50 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="user_id">User ID</option>
                  <option value="status">Status</option>
                </select>
              </div>
              
              <button
                onClick={fetchAnalyses}
                className={`flex items-center justify-center px-4 py-3 border border-transparent rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  mode === 'dark'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Refresh className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Results */}
          {filteredAnalyses.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center backdrop-blur-xl border transition-all duration-300 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h3 className={`text-2xl font-bold mb-2 ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyses.length === 0 ? 'No floor plan analyses found' : 'No results match your filters'}
              </h3>
              <p className={`text-lg ${
                mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {analyses.length === 0 
                  ? 'Floor plan analyses will appear here once users upload their floor plans.'
                  : 'Try adjusting your search criteria or filters.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`group rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    mode === 'dark' 
                      ? 'bg-slate-800/80 border-slate-700/50' 
                      : 'bg-white/80 border-slate-200/50'
                  } shadow-xl hover:shadow-2xl`}
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(analysis)}
                      alt={`Floor Plan Analysis ${analysis.id}`}
                      className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                      onClick={() => handleViewImage(analysis)}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                        analysis.status === 'completed' 
                          ? 'bg-green-500/90 text-white' 
                          : analysis.status === 'pending'
                          ? 'bg-orange-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {getStatusIcon(analysis.status)}
                        <span className="ml-1">{analysis.status.toUpperCase()}</span>
                      </span>
                    </div>
                    {analysis.vastu_score && (
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                          analysis.vastu_score >= 80 
                            ? 'bg-green-500/90 text-white' 
                            : analysis.vastu_score >= 60
                            ? 'bg-orange-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}>
                          Vastu: {analysis.vastu_score}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`text-lg font-bold ${
                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Analysis #{analysis.id}
                      </h3>
                      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreVert className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Person className="w-4 h-4 mr-2" />
                        User ID: {analysis.user_id}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        File ID: {analysis.file_id}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarToday className="w-4 h-4 mr-2" />
                        {formatDate(analysis.created_at)}
                      </div>
                      {analysis.updated_at !== analysis.created_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Updated: {formatDate(analysis.updated_at)}
                        </div>
                      )}
                      {analysis.recommendations && (
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Recommendations Available
                        </div>
                      )}
                    </div>

                    {/* Actions Section */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewImage(analysis)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <Visibility className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadImage(analysis)}
                        className="flex-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            maxHeight: '90vh',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Floor Plan Analysis Preview
        </DialogTitle>
        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
          {selectedImage && (
            <Box sx={{ p: 2 }}>
              <img
                src={selectedImage}
                alt="Floor Plan Analysis"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Close
          </Button>
          {selectedImage && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedImage;
                link.download = 'floorplan-analysis-preview.png';
                link.click();
                handleCloseDialog();
              }}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
