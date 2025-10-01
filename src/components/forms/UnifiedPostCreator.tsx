import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { apiService } from '@/utils/apiService';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import { useAuthUser } from '@/contexts/AuthContext';
import {
  ContentType,
  ComponentType,
  ContentComponent,
  CustomizablePost,
  componentTypes,
  defaultComponents,
  contentTypeConfig
} from '@/types/content';

// Material-UI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Fab,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

// Validation schema for customizable posts
const createPostSchema = (contentType: ContentType) => {
  const baseSchema: any = {
    components: yup.array().of(
      yup.object().shape({
        id: yup.string().required(),
        type: yup.string().required(),
        label: yup.string().required(),
        required: yup.boolean().required(),
        data: yup.mixed().optional(),
      })
    ).min(1, "At least one component is required"),
    category: yup.string().optional(),
  };

  return yup.object().shape(baseSchema);
};

interface UnifiedPostCreatorProps {
  onUpload?: () => void;
}

function UnifiedPostCreatorComponent({ onUpload }: UnifiedPostCreatorProps) {
  const [posts, setPosts] = useState<CustomizablePost[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showComponentSelector, setShowComponentSelector] = useState<string | null>(null);
  const [insertPosition, setInsertPosition] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const user = useAuthUser();
  const isAdmin = user?.role?.name === 'admin';

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && posts.length > 0) {
      const timer = setTimeout(() => {
        // Auto-save posts to localStorage
        localStorage.setItem('draftPosts', JSON.stringify(posts));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [posts, autoSave]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up any object URLs to prevent memory leaks
      posts.forEach(post => {
        post.components.forEach(component => {
          if (component.data instanceof File) {
            // Object URLs are automatically cleaned up when the component unmounts
            // but we can add additional cleanup if needed
          }
        });
      });
    };
  }, []);

  // Load drafts on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('draftPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Failed to load draft posts:', error);
      }
    }
  }, []);

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  // Create a new post
  const createNewPost = (contentType: ContentType) => {
    const timestamp = Date.now();
    const newPost: CustomizablePost = {
      id: `post-${timestamp}`,
      contentType,
      components: defaultComponents[contentType].map((type, index) => ({
        id: `comp-${timestamp}-${index}`,
        type,
        label: componentTypes[type].label,
        required: componentTypes[type].required,
        contentType,
      })),
      status: 'draft',
    };
    setPosts(prev => [...prev, newPost]);
    setExpandedPost(newPost.id);
    setShowAddDialog(false);
  };

  // Update post components
  const updatePostComponents = (postId: string, components: ContentComponent[]) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, components, status: 'draft' }
        : post
    ));
  };

  // Add component to post at specific position
  const addComponentToPost = (postId: string, componentType: ComponentType, insertAt?: number | null) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newComponent: ContentComponent = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      label: componentTypes[componentType].label,
      required: componentTypes[componentType].required,
      contentType: post.contentType,
    };

    let updatedComponents;
    if (insertAt !== null && insertAt !== undefined) {
      // Insert at specific position
      updatedComponents = [...post.components];
      updatedComponents.splice(insertAt, 0, newComponent);
    } else {
      // Add at the end
      updatedComponents = [...post.components, newComponent];
    }
    
    updatePostComponents(postId, updatedComponents);
    setShowComponentSelector(null);
    setInsertPosition(null);
  };

  // Remove component from post
  const removeComponentFromPost = (postId: string, componentId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedComponents = post.components.filter(comp => comp.id !== componentId);
    updatePostComponents(postId, updatedComponents);
  };

  // Update component data
  const updateComponentData = (postId: string, componentId: string, data: any) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedComponents = post.components.map(comp =>
      comp.id === componentId ? { ...comp, data } : comp
    );
    updatePostComponents(postId, updatedComponents);
  };

  // Move component
  const moveComponent = (postId: string, fromIndex: number, toIndex: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedComponents = [...post.components];
    const [movedComponent] = updatedComponents.splice(fromIndex, 1);
    updatedComponents.splice(toIndex, 0, movedComponent);
    updatePostComponents(postId, updatedComponents);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, postId: string, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveComponent(postId, draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Delete post
  const deletePost = (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    setPosts(prev => {
      const updatedPosts = prev.filter(post => post.id !== postId);
      // If the deleted post was expanded, close it
      if (expandedPost === postId) {
        setExpandedPost(null);
      }
      return updatedPosts;
    });
    
    // Show success message
    if (postToDelete) {
      setSuccess(`${contentTypeConfig[postToDelete.contentType].label} deleted successfully!`);
    }
  };

  // Validate post
  const validatePost = (post: CustomizablePost): boolean => {
    const requiredComponents = post.components.filter(comp => comp.required);
    
    // Check if all required components have data
    const hasRequiredData = requiredComponents.every(comp => {
      if (comp.type === 'file' || comp.type === 'image' || comp.type === 'thumbnail') {
        return comp.data instanceof File;
      }
      return comp.data && comp.data.toString().trim() !== '';
    });

    // Additional validation based on content type
    switch (post.contentType) {
      case 'tip':
        return hasRequiredData && 
               post.components.some(c => c.type === 'title' && c.data) &&
               post.components.some(c => c.type === 'content' && c.data) &&
               post.components.some(c => c.type === 'image' && c.data instanceof File);
      
      case 'book':
        return hasRequiredData && 
               post.components.some(c => c.type === 'title' && c.data) &&
               post.components.some(c => c.type === 'author' && c.data) &&
               post.components.some(c => c.type === 'summary' && c.data) &&
               post.components.some(c => c.type === 'file' && c.data instanceof File);
      
      case 'video':
        return hasRequiredData && 
               post.components.some(c => c.type === 'title' && c.data) &&
               post.components.some(c => c.type === 'description' && c.data) &&
               post.components.some(c => c.type === 'file' && c.data instanceof File);
      
      case 'podcast':
        return hasRequiredData && 
               post.components.some(c => c.type === 'title' && c.data) &&
               post.components.some(c => c.type === 'description' && c.data) &&
               post.components.some(c => c.type === 'file' && c.data instanceof File);
      
      default:
        return hasRequiredData;
    }
  };

  // Submit all posts
  const submitAllPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const validPosts = posts.filter(post => validatePost(post));
      const invalidPosts = posts.filter(post => !validatePost(post));

      if (invalidPosts.length > 0) {
        const invalidPostDetails = invalidPosts.map(post => {
          const missingFields = [];
          if (post.contentType === 'tip') {
            if (!post.components.some(c => c.type === 'title' && c.data)) missingFields.push('Title');
            if (!post.components.some(c => c.type === 'content' && c.data)) missingFields.push('Content');
            if (!post.components.some(c => c.type === 'image' && c.data instanceof File)) missingFields.push('Image');
          } else if (post.contentType === 'book') {
            if (!post.components.some(c => c.type === 'title' && c.data)) missingFields.push('Title');
            if (!post.components.some(c => c.type === 'author' && c.data)) missingFields.push('Author');
            if (!post.components.some(c => c.type === 'summary' && c.data)) missingFields.push('Summary');
            if (!post.components.some(c => c.type === 'file' && c.data instanceof File)) missingFields.push('PDF File');
          } else if (post.contentType === 'video') {
            if (!post.components.some(c => c.type === 'title' && c.data)) missingFields.push('Title');
            if (!post.components.some(c => c.type === 'description' && c.data)) missingFields.push('Description');
            if (!post.components.some(c => c.type === 'file' && c.data instanceof File)) missingFields.push('Video File');
          } else if (post.contentType === 'podcast') {
            if (!post.components.some(c => c.type === 'title' && c.data)) missingFields.push('Title');
            if (!post.components.some(c => c.type === 'description' && c.data)) missingFields.push('Description');
            if (!post.components.some(c => c.type === 'file' && c.data instanceof File)) missingFields.push('Audio File');
          }
          return `${contentTypeConfig[post.contentType].label}: Missing ${missingFields.join(', ')}`;
        }).join('; ');
        
        setError(`Please fill in all required fields: ${invalidPostDetails}`);
        setLoading(false);
        return;
      }

      if (validPosts.length === 0) {
        setError('No valid posts to submit');
        setLoading(false);
        return;
      }

      // Update status to uploading
      setPosts(prev => prev.map(post => 
        validPosts.some(validPost => validPost.id === post.id)
          ? { ...post, status: 'uploading' }
          : post
      ));

      // Submit each post
      const results = await Promise.allSettled(
        validPosts.map(async (post) => {
          try {
            const formData = new FormData();
            
            // Map components to API-specific fields based on content type
            post.components.forEach((component) => {
              switch (post.contentType) {
                case 'tip':
                  switch (component.type) {
                    case 'title':
                      formData.append('title', component.data);
                      break;
                    case 'content':
                      formData.append('content', component.data);
                      break;
                    case 'image':
                      if (component.data instanceof File) {
                        formData.append('image', component.data);
                      }
                      break;
                    case 'category':
                      formData.append('category', component.data);
                      break;
                  }
                  break;
                
                case 'book':
                  switch (component.type) {
                    case 'title':
                      formData.append('title', component.data);
                      break;
                    case 'author':
                      formData.append('author', component.data);
                      break;
                    case 'summary':
                      formData.append('summary', component.data);
                      break;
                    case 'file':
                      if (component.data instanceof File) {
                        formData.append('pdf', component.data);
                      }
                      break;
                    case 'rating':
                      formData.append('rating', component.data);
                      break;
                    case 'pages':
                      formData.append('pages', component.data);
                      break;
                    case 'price':
                      formData.append('price', component.data);
                      break;
                    case 'publication_year':
                      formData.append('publication_year', component.data);
                      break;
                    case 'publisher':
                      formData.append('publisher', component.data);
                      break;
                    case 'category':
                      formData.append('category', component.data);
                      break;
                    case 'isbn':
                      formData.append('isbn', component.data);
                      break;
                  }
                  break;
                
                case 'video':
                  switch (component.type) {
                    case 'title':
                      formData.append('title', component.data);
                      break;
                    case 'description':
                      formData.append('description', component.data);
                      break;
                    case 'file':
                      if (component.data instanceof File) {
                        formData.append('video', component.data);
                      }
                      break;
                    case 'thumbnail':
                      if (component.data instanceof File) {
                        formData.append('thumbnail', component.data);
                      }
                      break;
                    case 'category':
                      formData.append('category', component.data);
                      break;
                  }
                  break;
                
                case 'podcast':
                  switch (component.type) {
                    case 'title':
                      formData.append('title', component.data);
                      break;
                    case 'description':
                      formData.append('description', component.data);
                      break;
                    case 'file':
                      if (component.data instanceof File) {
                        formData.append('audio', component.data);
                      }
                      break;
                    case 'thumbnail':
                      if (component.data instanceof File) {
                        formData.append('thumbnail', component.data);
                      }
                      break;
                    case 'category':
                      formData.append('category', component.data);
                      break;
                    case 'duration':
                      formData.append('duration', component.data);
                      break;
                    case 'episode':
                      formData.append('episode', component.data);
                      break;
                  }
                  break;
              }
            });

            // Submit based on content type
            let response;
            switch (post.contentType) {
              case 'tip':
                response = await apiService.tips.create(formData);
                break;
              case 'book':
                response = await apiService.books.create(formData);
                break;
              case 'video':
                response = await apiService.videos.create(formData);
                break;
              case 'podcast':
                response = await apiService.podcasts.create(formData);
                break;
              default:
                throw new Error(`Unsupported content type: ${post.contentType}`);
            }

            return { postId: post.id, success: true, response };
          } catch (error) {
            return { postId: post.id, success: false, error: error as Error };
          }
        })
      );

      // Update post statuses based on results
      setPosts(prev => prev.map(post => {
        const result = results.find(r => r.status === 'fulfilled' && r.value.postId === post.id);
        if (result && result.status === 'fulfilled') {
          return {
            ...post,
            status: result.value.success ? 'uploaded' : 'error',
            error: result.value.success ? undefined : result.value.error?.message
          };
        }
        return post;
      }));

      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const errorCount = results.length - successCount;

      if (errorCount === 0) {
        setSuccess(`Successfully uploaded ${successCount} post(s)!`);
        // Clear all posts after successful upload
        setTimeout(() => {
          setPosts([]);
          onUpload?.();
        }, 2000);
      } else {
        setError(`Uploaded ${successCount} post(s), ${errorCount} failed`);
      }

    } catch (error: any) {
      setError(error.message || 'An error occurred while uploading posts');
    } finally {
      setLoading(false);
    }
  };

  // Get available components for a content type
  const getAvailableComponents = (contentType: ContentType): ComponentType[] => {
    return Object.keys(componentTypes).filter(type => {
      const config = componentTypes[type as ComponentType];
      return !config.contentType || config.contentType.includes(contentType);
    }) as ComponentType[];
  };

  // Render component input
  const renderComponentInput = (post: CustomizablePost, component: ContentComponent) => {
    const config = componentTypes[component.type];
    
    switch (config.inputType) {
      case 'text':
        return (
          <TextField
            label={component.label}
            fullWidth
            required={component.required}
            value={component.data || ''}
            onChange={(e) => updateComponentData(post.id, component.id, e.target.value)}
            sx={{ mb: 2 }}
          />
        );
      case 'textarea':
        return (
          <TextField
            label={component.label}
            fullWidth
            multiline
            rows={component.type === 'content' || component.type === 'summary' || component.type === 'description' ? 4 : 3}
            required={component.required}
            value={component.data || ''}
            onChange={(e) => updateComponentData(post.id, component.id, e.target.value)}
            sx={{ mb: 2 }}
          />
        );
      case 'number':
        return (
          <TextField
            label={component.label}
            fullWidth
            type="number"
            required={component.required}
            value={component.data || ''}
            onChange={(e) => updateComponentData(post.id, component.id, e.target.value)}
            sx={{ mb: 2 }}
          />
        );
      case 'url':
        return (
          <TextField
            label={component.label}
            fullWidth
            type="url"
            required={component.required}
            value={component.data || ''}
            onChange={(e) => updateComponentData(post.id, component.id, e.target.value)}
            sx={{ mb: 2 }}
          />
        );
      case 'select':
        return (
          <TextField
            label={component.label}
            fullWidth
            select
            required={component.required}
            value={component.data || ''}
            onChange={(e) => updateComponentData(post.id, component.id, e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            {config.options?.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        );
      case 'file':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.label} {component.required && '*'}
            </Typography>
            <input
              type="file"
              accept={post.contentType === 'book' ? 'application/pdf' : 
                     post.contentType === 'video' ? 'video/mp4,video/webm,video/avi,video/mov' :
                     post.contentType === 'podcast' ? 'audio/mp3,audio/wav,audio/ogg,audio/mpeg' :
                     config.accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Validate file type based on content type
                  let isValidType = false;
                  switch (post.contentType) {
                    case 'book':
                      isValidType = file.type === 'application/pdf';
                      break;
                    case 'video':
                      isValidType = file.type.startsWith('video/') && 
                                   (file.type === 'video/mp4' || 
                                    file.type === 'video/webm' || 
                                    file.type === 'video/avi' || 
                                    file.type === 'video/mov' ||
                                    file.type === 'video/quicktime');
                      break;
                    case 'podcast':
                      isValidType = file.type.startsWith('audio/') && 
                                   (file.type === 'audio/mp3' || 
                                    file.type === 'audio/wav' || 
                                    file.type === 'audio/ogg' ||
                                    file.type === 'audio/mpeg');
                      break;
                    case 'tip':
                      isValidType = file.type.startsWith('image/') && 
                                   (file.type === 'image/jpeg' || 
                                    file.type === 'image/png' || 
                                    file.type === 'image/webp' ||
                                    file.type === 'image/gif');
                      break;
                    default:
                      isValidType = true;
                  }
                  
                  if (!isValidType) {
                    setError(`Invalid file type for ${post.contentType}. Expected: ${config.accept}`);
                    return;
                  }
                  
                  // Validate file size
                  const maxSize = post.contentType === 'book' ? 25 * 1024 * 1024 : // 25MB for PDFs
                                 post.contentType === 'video' ? 100 * 1024 * 1024 : // 100MB for videos
                                 post.contentType === 'podcast' ? 50 * 1024 * 1024 : // 50MB for audio
                                 10 * 1024 * 1024; // 10MB for images
                  
                  if (file.size > maxSize) {
                    setError(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
                    return;
                  }
                  
                  updateComponentData(post.id, component.id, file);
                }
              }}
              style={{ display: 'block', marginBottom: 8 }}
            />
            {component.data && component.data instanceof File && (
              <Typography variant="body2" color="text.secondary">
                Selected: {component.data.name} ({(component.data.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  // Render post preview
  const renderPostPreview = (post: CustomizablePost) => {
    return (
      <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
        {post.components.map((component) => {
          if (!component.data) return null;
          
          switch (component.type) {
            case 'title':
              return (
                <Typography key={component.id} variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {component.data}
                </Typography>
              );
            case 'author':
              return (
                <Typography key={component.id} variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                  By: {component.data}
                </Typography>
              );
            case 'content':
            case 'summary':
            case 'description':
              return (
                <Typography key={component.id} variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                  {component.data}
                </Typography>
              );
            case 'notes':
              return (
                <Box key={component.id} sx={{ mb: 2, p: 1, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Notes:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {component.data}
                  </Typography>
                </Box>
              );
            case 'link':
              return (
                <Box key={component.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    🔗 {component.data}
                  </Typography>
                </Box>
              );
            case 'image':
            case 'thumbnail':
              return (
                <Box key={component.id} sx={{ mb: 2, textAlign: 'center' }}>
                  {component.data instanceof File ? (
                    <img
                      src={URL.createObjectURL(component.data)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No image selected
                    </Typography>
                  )}
                </Box>
              );
            default:
              return null;
          }
        })}
        {post.components.every(comp => !comp.data) && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Fill in the component data below to see a preview
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Modern Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          p: 3,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.3)'
            : '0 4px 24px rgba(0, 0, 0, 0.1)',
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: theme.palette.primary.main,
                display: 'inline-block',
                mr: 1,
              }} />
              Unified Content Creator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage multiple posts with customizable components
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${posts.length} Post${posts.length !== 1 ? 's' : ''}`}
              color="primary"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${posts.filter(validatePost).length} Ready`}
              color="success"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={autoSave ? "Auto-save ON" : "Auto-save OFF"}
              color={autoSave ? "success" : "default"}
              variant="outlined"
              onClick={() => setAutoSave(!autoSave)}
              sx={{ 
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: autoSave ? 'success.light' : 'action.hover',
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Add Post Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Tooltip title="Add New Post" placement="top">
          <Fab
            color="primary"
            onClick={() => setShowAddDialog(true)}
            sx={{ 
              width: 64, 
              height: 64,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Tooltip>
      </Box>

      {/* Posts List */}
      {posts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {posts.map((post, index) => (
            <Card key={post.id} sx={{ mb: 2, position: 'relative' }}>
              <Accordion
                expanded={expandedPost === post.id}
                onChange={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 2, 
                    py: 1,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Chip
                      label={`${contentTypeConfig[post.contentType].icon} ${contentTypeConfig[post.contentType].label}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {post.components.find(c => c.type === 'title')?.data || `Untitled ${contentTypeConfig[post.contentType].label}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.status === 'uploaded' && <CheckCircleIcon color="success" />}
                      {post.status === 'error' && <ErrorIcon color="error" />}
                      {post.status === 'uploading' && <PendingIcon color="primary" />}
                    </Box>
                  </Box>
                </AccordionSummary>
                <IconButton
                  size="small"
                  onClick={() => setDeleteConfirm(post.id)}
                  color="error"
                  sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: 8,
                    zIndex: 1,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: theme.palette.error.light,
                      color: 'white',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                  {/* Left Column - Components */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2,
                      p: 2,
                      background: isDarkMode 
                        ? 'rgba(15, 23, 42, 0.5)'
                        : 'rgba(248, 250, 252, 0.5)',
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Components Management
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setShowComponentSelector(post.id);
                          setInsertPosition(null);
                        }}
                        sx={{ 
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        }}
                      >
                        Add Component
                      </Button>
                    </Box>
                    
                    {/* Component Management */}
                    <Paper sx={{ 
                      p: 2, 
                      mb: 3, 
                      bgcolor: theme.palette.background.default,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Current Components (drag to reorder):
                      </Typography>
                      {post.components.map((component, compIndex) => (
                        <Paper
                          key={component.id}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(compIndex);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragOver(e);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDrop(e, post.id, compIndex);
                          }}
                          onDragEnd={(e) => {
                            e.stopPropagation();
                            handleDragEnd();
                          }}
                          sx={{
                            p: 2,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            cursor: 'grab',
                            opacity: draggedIndex === compIndex ? 0.5 : 1,
                            transform: draggedIndex === compIndex ? 'rotate(2deg)' : 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: isDarkMode 
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                : '0 4px 12px rgba(0, 0, 0, 0.1)',
                            }
                          }}
                        >
                          <DragIndicatorIcon sx={{ color: theme.palette.text.secondary, cursor: 'grab' }} />
                          <Chip
                            label={`${componentTypes[component.type].icon} ${component.label}`}
                            color={component.required ? 'primary' : 'default'}
                            variant={component.required ? 'filled' : 'outlined'}
                            sx={{ 
                              fontWeight: 600,
                              pointerEvents: 'none', // Prevent chip from interfering with drag
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }} />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeComponentFromPost(post.id, component.id);
                              }}
                              disabled={component.required}
                              color="error"
                              sx={{
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'white',
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Paper>
                      ))}
                    </Paper>

                    {/* Component Inputs */}
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: isDarkMode 
                        ? 'rgba(15, 23, 42, 0.3)'
                        : 'rgba(248, 250, 252, 0.5)',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      mb: 3,
                    }}>
                      <Typography variant="h6" sx={{ 
                        mb: 3, 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}>
                        <Box sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main,
                        }} />
                        Fill Component Data
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {post.components.map((component) => (
                          <Box 
                            key={component.id}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.paper,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                boxShadow: isDarkMode 
                                  ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              mb: 2,
                              pb: 1,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}>
                              <Chip
                                label={`${componentTypes[component.type].icon} ${component.label}`}
                                size="small"
                                color={component.required ? 'primary' : 'default'}
                                variant={component.required ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 600 }}
                              />
                              {component.required && (
                                <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                                  Required
                                </Typography>
                              )}
                            </Box>
                            {renderComponentInput(post, component)}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Right Column - Preview */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: isDarkMode 
                        ? 'rgba(15, 23, 42, 0.3)'
                        : 'rgba(248, 250, 252, 0.5)',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      mb: 3,
                    }}>
                      <Typography variant="h6" sx={{ 
                        mb: 3, 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}>
                        <Box sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.secondary.main,
                        }} />
                        Live Preview
                      </Typography>
                      <Box sx={{
                        p: 2,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        minHeight: 200,
                        maxHeight: 400,
                        overflow: 'auto',
                      }}>
                        {renderPostPreview(post)}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            </Card>
          ))}
        </Box>
      )}

      {/* Submit All Button */}
      {posts.length > 0 && (
        <Card
          sx={{
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<UploadIcon />}
                onClick={submitAllPosts}
                disabled={loading || posts.every(post => !validatePost(post))}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabled,
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {loading ? 'Uploading...' : `Submit All Posts (${posts.filter(validatePost).length}/${posts.length})`}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(!showPreview)}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {posts.filter(validatePost).length === posts.length 
                ? 'All posts are ready to submit!' 
                : `${posts.length - posts.filter(validatePost).length} post(s) need required fields filled`}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {showPreview && posts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PreviewIcon /> Preview All Posts
            </Typography>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
              {posts.map((post) => (
                <Card key={post.id} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip
                        label={contentTypeConfig[post.contentType].label}
                        color="primary"
                        size="small"
                        icon={<span>{contentTypeConfig[post.contentType].icon}</span>}
                      />
                      <Box sx={{ flexGrow: 1 }} />
                      {post.status === 'uploaded' && <CheckCircleIcon color="success" fontSize="small" />}
                      {post.status === 'error' && <ErrorIcon color="error" fontSize="small" />}
                      {post.status === 'uploading' && <PendingIcon color="primary" fontSize="small" />}
                    </Box>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {renderPostPreview(post)}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Loading Progress */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Component Selector Dialog */}
      <Dialog 
        open={!!showComponentSelector} 
        onClose={() => {
          setShowComponentSelector(null);
          setInsertPosition(null);
        }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              🎯 Choose Component Type
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {insertPosition !== null 
                ? `Insert component at position ${insertPosition + 1}`
                : 'Add component to the end'
              }
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ 
            display: 'grid', 
            gap: 2, 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } 
          }}>
            {showComponentSelector && getAvailableComponents(
              posts.find(p => p.id === showComponentSelector)?.contentType || 'tip'
            ).map((componentType) => (
              <Card
                key={componentType}
                onClick={() => addComponentToPost(showComponentSelector, componentType, insertPosition)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid transparent`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${componentTypes[componentType].icon}40`,
                    border: `2px solid ${theme.palette.primary.main}60`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {componentTypes[componentType].icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {componentTypes[componentType].label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {componentTypes[componentType].required ? 'Required' : 'Optional'}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setShowComponentSelector(null);
              setInsertPosition(null);
            }}
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Post Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={() => setShowAddDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              🎯 Choose Content Type
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select the type of content you want to create
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
            {Object.entries(contentTypeConfig).map(([type, config]) => (
              <Card
                key={type}
                onClick={() => createNewPost(type as ContentType)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: `2px solid transparent`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${config.color}40`,
                    border: `2px solid ${config.color}60`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {config.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {config.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a new {config.label.toLowerCase()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setShowAddDialog(false)}
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deleteConfirm} 
        onClose={() => setDeleteConfirm(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
              ⚠️ Delete Post
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, textAlign: 'center' }}>
          {deleteConfirm && (
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.background.default, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {posts.find(p => p.id === deleteConfirm)?.components.find(c => c.type === 'title')?.data || 'Untitled Post'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contentTypeConfig[posts.find(p => p.id === deleteConfirm)?.contentType || 'tip'].label}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
          <Button 
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (deleteConfirm) {
                deletePost(deleteConfirm);
                setDeleteConfirm(null);
              }
            }}
            variant="contained"
            color="error"
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Delete Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Export with dynamic import to prevent hydration issues
export default dynamic(() => Promise.resolve(UnifiedPostCreatorComponent), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 200,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderRadius: 3,
    }}>
      <Typography variant="body2" color="text.secondary">
        Loading Unified Post Creator...
      </Typography>
    </Box>
  )
});
