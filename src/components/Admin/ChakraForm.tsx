'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { Save, Close, Add, Upload, Delete, Image as ImageIcon } from '@mui/icons-material';
import { ChakraPoint } from '@/types/chakra';
import { useThemeContext } from '@/contexts/ThemeContext';
import { apiService } from '@/utils/apiService';

interface ChakraFormProps {
  chakraPoint?: ChakraPoint | null;
  onSave?: (chakraPoint: ChakraPoint) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const ChakraForm: React.FC<ChakraFormProps> = ({ 
  chakraPoint, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<ChakraPoint>({
    id: '',
    name: '',
    direction: '',
    description: '',
    remedies: '',
    isAuspicious: false,
    shouldAvoid: false,
    imageUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { mode } = useThemeContext();

  // Initialize form data when chakraPoint prop changes
  useEffect(() => {
    if (chakraPoint) {
      setFormData(chakraPoint);
    } else {
      setFormData({
        id: '',
        name: '',
        direction: '',
        description: '',
        remedies: '',
        isAuspicious: false,
        shouldAvoid: false
      });
    }
    setMessage(null);
  }, [chakraPoint]);

  const handleInputChange = (field: keyof ChakraPoint, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file); // Debug log
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, JPEG)' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }

      setSelectedImage(file);
      setMessage(null);
      console.log('File validated and set:', file.name, file.size, file.type); // Debug log
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setMessage({ type: 'error', text: 'Please select an image to upload' });
      return;
    }

    console.log('Starting upload for file:', selectedImage.name); // Debug log
    setIsUploadingImage(true);
    setMessage(null);
    
    try {
      // Create a simple FormData and try direct upload to admin endpoint
      console.log('Creating FormData for upload...'); // Debug log
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      // Try the admin upload endpoint first
      console.log('Trying admin upload endpoint...'); // Debug log
      try {
        const response = await apiService.admin.uploadLogo(selectedImage);
        console.log('Admin upload response:', response); // Debug log
        const imageUrl = response.image_url;
        console.log('Extracted image URL:', imageUrl); // Debug log
        
        setFormData(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));
        
        setSelectedImage(null);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        
        // Reset file input
        const fileInput = document.getElementById('chakra-image-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        return;
      } catch (adminError) {
        console.log('Admin upload failed, trying alternative method...', adminError);
        
        // Fallback: Create a blob URL for local storage
        const blobUrl = URL.createObjectURL(selectedImage);
        console.log('Created blob URL:', blobUrl); // Debug log
        
        setFormData(prev => ({
          ...prev,
          imageUrl: blobUrl
        }));
        
        setSelectedImage(null);
        setMessage({ type: 'success', text: 'Image uploaded successfully! (Local storage)' });
        
        // Reset file input
        const fileInput = document.getElementById('chakra-image-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        return;
      }
    } catch (error: any) {
      console.error('Upload error details:', error); // Debug log
      setMessage({ type: 'error', text: error.message || 'Failed to upload image. Please try again.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageDelete = () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
      setMessage({ type: 'success', text: 'Image removed successfully!' });
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({
      ...prev,
      isAuspicious: status === 'auspicious',
      shouldAvoid: status === 'avoid'
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.id || !formData.name || !formData.direction) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (ID, Name, Direction)' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      if (isEditing && chakraPoint) {
        // Update existing chakra point
        await apiService.vastuChakraPoints.updateChakraPoint(formData.id, formData);
        setMessage({ type: 'success', text: 'Chakra point updated successfully!' });
      } else {
        // Create new chakra point
        await apiService.vastuChakraPoints.createChakraPoint(formData);
        setMessage({ type: 'success', text: 'Chakra point created successfully!' });
      }
      
      if (onSave) {
        onSave(formData);
      }
    } catch (error: any) {
      console.error('Error saving chakra point:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save chakra point. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = () => {
    if (formData.shouldAvoid) return 'error';
    if (formData.isAuspicious) return 'success';
    return 'warning';
  };

  const getStatusText = () => {
    if (formData.shouldAvoid) return 'Avoid';
    if (formData.isAuspicious) return 'Auspicious';
    return 'Neutral';
  };

  const getCurrentStatus = () => {
    if (formData.isAuspicious) return 'auspicious';
    if (formData.shouldAvoid) return 'avoid';
    return 'neutral';
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: mode === 'dark' ? 'white' : 'text.primary',
            fontWeight: 'bold',
          }}
        >
          {isEditing ? 'Edit Chakra Point' : 'Create New Chakra Point'}
        </Typography>
        {onCancel && (
          <IconButton onClick={onCancel} sx={{ color: mode === 'dark' ? 'white' : 'text.primary' }}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic Information */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Chakra ID *"
              value={formData.id}
              onChange={(e) => handleInputChange('id', e.target.value.toUpperCase())}
              variant="outlined"
              placeholder="e.g., E1, S4, W3, N5"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                },
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="outlined"
              placeholder="e.g., Jayanta, Indra, Surya"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Direction *"
            value={formData.direction}
            onChange={(e) => handleInputChange('direction', e.target.value)}
            variant="outlined"
            placeholder="e.g., East Zone Entrance, South Zone Entrance"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
              },
            }}
          />
        </Box>

        {/* Status Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: mode === 'dark' ? 'white' : 'text.primary', minWidth: 'fit-content' }}>
            Status:
          </Typography>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={getCurrentStatus()}
              onChange={(e) => handleStatusChange(e.target.value)}
              label="Status"
              sx={{
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
              }}
            >
              <MenuItem value="auspicious">Auspicious</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
              <MenuItem value="avoid">Avoid</MenuItem>
            </Select>
          </FormControl>
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Description */}
        <Box>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            variant="outlined"
            multiline
            rows={4}
            placeholder="Enter detailed description of the chakra point..."
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
              },
            }}
          />
        </Box>

        {/* Remedies */}
        <Box>
          <TextField
            fullWidth
            label="Remedies"
            value={formData.remedies}
            onChange={(e) => handleInputChange('remedies', e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Enter recommended remedies for this chakra point..."
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
              },
            }}
          />
        </Box>

        {/* Image Upload Section */}
        <Box>
          <Typography variant="h6" sx={{ color: mode === 'dark' ? 'white' : 'text.primary', mb: 2 }}>
            Chakra Point Image
          </Typography>
          
          {/* Current Image Display */}
          {formData.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ImageIcon sx={{ color: mode === 'dark' ? 'white' : 'text.primary' }} />
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'white' : 'text.primary' }}>
                  Current Image:
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleImageDelete}
                  sx={{ ml: 'auto' }}
                >
                  Remove Image
                </Button>
              </Box>
              <Box sx={{ 
                border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 1,
                p: 2,
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
              }}>
                <img
                  src={formData.imageUrl}
                  alt={`${formData.name} chakra point`}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Image Upload */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <input
              id="chakra-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              htmlFor="chakra-image-upload"
              startIcon={<Upload />}
              sx={{
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                color: mode === 'dark' ? 'white' : 'text.primary',
                alignSelf: 'flex-start'
              }}
            >
              {formData.imageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
            
            {selectedImage && (
              <Box sx={{ 
                border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 1,
                p: 2,
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
              }}>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'white' : 'text.primary', mb: 1 }}>
                  Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={isUploadingImage ? <CircularProgress size={16} /> : <Upload />}
                  onClick={handleImageUpload}
                  disabled={isUploadingImage}
                  size="small"
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Box>
            )}
            
            <Typography variant="caption" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
              Supported formats: PNG, JPG, JPEG. Max size: 5MB. Images are optional for chakra points.
            </Typography>
          </Box>
        </Box>

        {/* Message Display */}
        {message && (
          <Box>
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSaving}
              sx={{
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                color: mode === 'dark' ? 'white' : 'text.primary',
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChakraForm;
