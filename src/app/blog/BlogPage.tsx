"use client";

import React, { useState, useEffect } from 'react';
// Make Navbar and Footer client-only to prevent hydration issues
const ClientNavbar = dynamic(() => import('@/components/ui/Navbar'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1100,
      height: '64px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    }} />
  )
});

const ClientFooter = dynamic(() => import('@/components/ui/Footer'), { 
  ssr: false,
  loading: () => null
});
import dynamic from 'next/dynamic';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { apiService } from '@/utils/apiService';
import { api } from '@/utils/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/utils/permissions';
import PostUploadSection from '@/components/forms/PostUploadSection';
import { BookOpen, Video, Headphones, Lightbulb, Sparkles, FileText, Plus, Image as ImageIcon, Eye } from 'lucide-react';

// Hook to prevent hydration issues
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

const BlogCardsList = dynamic(() => import('@/components/Card/BlogCardsList'), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const VideoCardsList = dynamic(() => import('@/components/Card/VideoCardsList'), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const BookCardsList = dynamic(() => import('@/components/Card/BookCardsList'), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});
const PodcastCardsList = dynamic(() => import('@/components/Card/PodcastCardsList'), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      height: '200px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
      border: '1px dashed rgba(59, 130, 246, 0.2)',
    }}>
      <Typography variant="body2" color="text.secondary">Loading...</Typography>
    </Box>
  ),
});

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fadein" style={{ minHeight: 'auto', width: '100%' }}>
      {children}
    </div>
  );
}

// Tips Cards List with Popup Functionality
function TipsCardsList() {
  const { theme, isDarkMode } = useGlobalTheme();
  const { user } = useAuth();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Check if user is admin
  const isAdmin = isAdminUser(user);

  // Fetch tips
  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await apiService.tips.getAll();
      console.log('Fetched tips:', response);
      setTips(response || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleTipClick = (tip: any) => {
    setSelectedTip(tip);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedTip(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
        borderRadius: 3,
        border: '1px dashed rgba(59, 130, 246, 0.2)',
      }}>
        <Typography variant="body2" color="text.secondary">Loading tips...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Create Button for Admin */}
      {isAdmin && (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Vastu Tips
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
            onClick={() => setShowCreateForm(true)}
          sx={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            },
          }}
        >
            Create Custom Tip
        </Button>
      </Box>
      )}

      {/* Tips Grid */}
      {tips.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          background: isDarkMode
            ? 'rgba(15, 23, 42, 0.5)'
            : 'rgba(248, 250, 252, 0.5)',
          borderRadius: 2,
          border: '1px dashed rgba(148, 163, 184, 0.3)',
        }}>
          <Lightbulb size={48} style={{ color: theme.palette.text.secondary, marginBottom: '16px' }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Tips Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? 'Create your first tip to get started' : 'Check back later for new tips'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 2 
        }}>
          {tips.map((tip, index) => (
            <Card
            key={tip.id || index}
              sx={{
                background: isDarkMode
                  ? 'rgba(15, 23, 42, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode
                  ? '1px solid rgba(148, 163, 184, 0.1)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDarkMode
                  ? '0 8px 32px rgba(255, 255, 255, 0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.15)',
              }
            }}
            onClick={() => handleTipClick(tip)}
            >
              <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Lightbulb size={20} style={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, flex: 1 }}>
                  {tip.title || 'Untitled'}
                  </Typography>
                <IconButton size="small" color="primary">
                  <Eye size={16} />
                </IconButton>
              </Box>
              
              {tip.image_url ? (
                <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                  <img 
                    src={String(tip.image_url).startsWith('http') ? String(tip.image_url) : `${api.getBaseURL()}${tip.image_url}`}
                    alt={tip.title || 'Tip image'}
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      const fullUrl = String(tip.image_url).startsWith('http') ? String(tip.image_url) : `${api.getBaseURL()}${tip.image_url}`;
                      console.error('Image failed to load:', {
                        original: tip.image_url,
                        fullUrl: fullUrl,
                        apiBaseUrl: api.getBaseURL()
                      });
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ 
                  mb: 2, 
                  height: '120px', 
                  borderRadius: 1, 
                  background: isDarkMode 
                    ? 'rgba(148, 163, 184, 0.1)' 
                    : 'rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ImageIcon size={32} style={{ color: theme.palette.text.secondary }} />
                  </Box>
                )}
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {String(tip.details || tip.description || tip.content || 'No description available')}
              </Typography>
              
              {tip.category && (
                <Chip 
                  label={String(tip.category)} 
                  size="small" 
                  variant="outlined" 
                  sx={{ 
                    background: theme.palette.primary.main + '20',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }} 
                />
              )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Tip Popup Modal */}
      <Dialog 
        open={openPopup} 
        onClose={handleClosePopup} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: isDarkMode
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
          }
        }}
      >
        {selectedTip && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Lightbulb size={24} style={{ color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                  {selectedTip.title || 'Untitled'}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedTip.image_url && (
                <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                  <img 
                    src={String(selectedTip.image_url).startsWith('http') ? String(selectedTip.image_url) : `${api.getBaseURL()}${selectedTip.image_url}`}
                    alt={selectedTip.title || 'Tip image'}
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      const fullUrl = String(selectedTip.image_url).startsWith('http') ? String(selectedTip.image_url) : `${api.getBaseURL()}${selectedTip.image_url}`;
                      console.error('Popup image failed to load:', {
                        original: selectedTip.image_url,
                        fullUrl: fullUrl,
                        apiBaseUrl: api.getBaseURL()
                      });
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {String(selectedTip.details || selectedTip.description || selectedTip.content || 'No description available')}
              </Typography>
              
              {selectedTip.category && (
                <Box sx={{ mt: 3 }}>
                  <Chip 
                    label={String(selectedTip.category)} 
                    variant="outlined" 
                    sx={{ 
                      background: theme.palette.primary.main + '20',
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main
                    }} 
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Custom Tip Dialog */}
      <Dialog 
        open={showCreateForm} 
        onClose={() => setShowCreateForm(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: isDarkMode
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Lightbulb size={24} style={{ color: theme.palette.primary.main }} />
            <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
              Create Custom Tip
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use the Posts tab to create rich, multi-media tips with images, content, links, and more!
          </Typography>
          <Box sx={{ 
            p: 3, 
            background: isDarkMode 
              ? 'rgba(59, 130, 246, 0.1)' 
              : 'rgba(59, 130, 246, 0.05)',
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.main}20`
          }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}>
              Enhanced Tip Creation Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Add multiple images with descriptions
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Include rich text content blocks
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Add external links and references
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Upload supporting files and documents
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                Organize with categories and tags
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateForm(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setShowCreateForm(false);
              // Switch to Posts tab (index 4 for admin users)
              const event = new CustomEvent('switchToPostsTab');
              window.dispatchEvent(event);
            }} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              },
            }}
          >
            Go to Posts Tab
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Simple Admin-Only Posts Management Component
function PostsManagement() {
  const { theme, isDarkMode } = useGlobalTheme();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = isAdminUser(user);

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        background: isDarkMode
          ? 'rgba(15, 23, 42, 0.5)'
          : 'rgba(248, 250, 252, 0.5)',
        borderRadius: 2,
        border: '1px dashed rgba(148, 163, 184, 0.3)',
      }}>
        <FileText size={48} style={{ color: theme.palette.text.secondary, marginBottom: '16px' }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Admin Access Required
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Only administrators can create and manage posts
        </Typography>
      </Box>
    );
  }

  // Show the existing PostUploadSection for admin users
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Create New Content
        </Typography>
        <Chip 
          label="Admin" 
          color="success" 
          size="small" 
          sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 'bold'
          }} 
        />
      </Box>
      <PostUploadSection />
    </Box>
  );
}


function BlogTabs() {
  const { theme, isDarkMode } = useGlobalTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  // Check if user is admin
  const isAdmin = isAdminUser(user);

  // Define tabs - Posts tab only visible to admin
  const allTabs = [
    { label: "Videos", icon: Video, type: "videos" },
    { label: "Books", icon: BookOpen, type: "books" },
    { label: "Podcasts", icon: Headphones, type: "podcasts" },
    { label: "Tips", icon: Lightbulb, type: "tips" },
    { label: "Posts", icon: FileText, type: "posts", adminOnly: true }
  ];

  // Filter tabs based on admin status
  const tabs = allTabs.filter(tab => !tab.adminOnly || isAdmin);

  // Reset tab if current tab is out of bounds (e.g., when admin status changes)
  useEffect(() => {
    if (tab >= tabs.length) {
      setTab(0);
    }
  }, [tabs.length, tab]);

  // Listen for tab switch events from Tips section
  useEffect(() => {
    const handleSwitchToPostsTab = () => {
      const postsTabIndex = tabs.findIndex(t => t.type === 'posts');
      if (postsTabIndex !== -1) {
        setTab(postsTabIndex);
      }
    };

    window.addEventListener('switchToPostsTab', handleSwitchToPostsTab);
    return () => window.removeEventListener('switchToPostsTab', handleSwitchToPostsTab);
  }, [tabs]);

  // Handle tab change with proper validation
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue >= 0 && newValue < tabs.length) {
      setTab(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: { xs: 0.5, sm: 1 } }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Blog content tabs"
        sx={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          mb: 1,
          minHeight: { xs: 40, sm: 48 },
          '.MuiTabs-flexContainer': {
            justifyContent: { xs: 'flex-start', sm: 'center' },
            gap: 0.25,
          },
          '.MuiTabs-scrollButtons': {
            color: isDarkMode ? '#60a5fa' : '#1e40af',
            '&.Mui-disabled': { opacity: 0.3 },
          },
          '.MuiTabs-indicator': {
            background: isDarkMode
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            height: 3,
            borderRadius: 2,
            boxShadow: isDarkMode
              ? '0 2px 8px rgba(96, 165, 250, 0.3)'
              : '0 2px 8px rgba(30, 64, 175, 0.3)',
          },
        }}
      >
        {tabs.map(({ label, icon: IconComponent, type }, index) => (
          <Tab 
            key={type}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconComponent size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                <span>{label}</span>
              </Box>
            }
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, 
              color: theme.palette.text.primary, 
              minHeight: { xs: 44, sm: 52 }, 
              px: { xs: 1.5, sm: 2, md: 2.5 },
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: isDarkMode ? '#60a5fa' : '#1e40af',
                transform: 'translateY(-1px)',
              },
              '&.Mui-selected': {
                color: isDarkMode ? '#60a5fa' : '#1e40af',
                fontWeight: 700,
              }
            }} 
          />
        ))}
      </Tabs>
      <Box sx={{ 
        mt: 0.5, 
        minHeight: 'auto', 
        px: { xs: 0.5, sm: 1, md: 2 }, 
        overflowX: 'hidden', 
        overflowY: 'auto',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {tabs[tab]?.type === "videos" && (
          <FadeInSection>
            <VideoCardsList />
          </FadeInSection>
        )}
        {tabs[tab]?.type === "books" && (
          <FadeInSection>
            <BookCardsList />
          </FadeInSection>
        )}
        {tabs[tab]?.type === "podcasts" && (
          <FadeInSection>
            <PodcastCardsList />
          </FadeInSection>
        )}
        {tabs[tab]?.type === "tips" && (
          <FadeInSection>
            <TipsCardsList />
          </FadeInSection>
        )}
        {tabs[tab]?.type === "posts" && (
          <FadeInSection>
            <PostsManagement />
          </FadeInSection>
        )}
    </Box>
    </Box>
  );
}

export default function BlogPage() {
  const { theme, isDarkMode } = useGlobalTheme();
  const isClient = useIsClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe theme fallback for SSR
  const safeTheme = theme || {
    palette: {
      mode: 'light' as const,
      primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#ffffff' },
      secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2', contrastText: '#ffffff' },
      background: { default: '#ffffff', paper: '#ffffff' },
      text: { primary: '#000000', secondary: '#666666' },
      divider: '#e0e0e0'
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !isClient) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary">
            Loading Blog...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        background: safeTheme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Animated gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: safeTheme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
            : 'linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)',
          animation: 'gradientShift 8s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%, 100%': {
              opacity: 0.3,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.6,
              transform: 'scale(1.1)',
            },
          },
        }}
      />
      
      <ClientNavbar />
      
      {/* Main content container */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: '100vw',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2, md: 3 },
          pt: { xs: '7rem', sm: '8rem', md: '4.9rem' },
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: isDarkMode
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(148, 163, 184, 0.2)',
            p: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '100%',
            minHeight: 'calc(100vh - 12rem)',
            overflowX: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 2,
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  border: isDarkMode
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Sparkles 
                  size={35} 
                  className={safeTheme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} 
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: safeTheme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                mb: 0.5,
              }}
            >
              Explore Vastu Resources
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Discover videos, books, podcasts, and tips to enhance your understanding of Vastu
            </Typography>
          </Box>
          
          <BlogTabs />
        </Box>
      </Box>
      
      <ClientFooter />
    </Box>
  );
}