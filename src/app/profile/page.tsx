'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Avatar, Button, TextField, Grid, Card, CardContent, Divider, Alert, CircularProgress } from '@mui/material';
import { Edit, Save, Cancel, Person, Email, CalendarToday, Security, CheckCircle } from '@mui/icons-material';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useAuthUser, useAuthActions } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { apiService } from '@/utils/apiService';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  role: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { mode } = useThemeContext();
  const user = useAuthUser();
  const { updateUser } = useAuthActions();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Profile page is accessible to all authenticated users (both regular users and admins)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await apiService.auth.me();
        setProfile(userData);
        setFormData({
          name: userData.full_name || userData.name || '',
          email: userData.email || ''
        });
      } catch (error: any) {
        // console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.full_name || profile?.name || '',
      email: profile?.email || ''
    });
    setError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate form data
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }

      // Update profile
      const updatedUser = await apiService.users.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      // Update the profile state with the new data
      setProfile(prevProfile => ({
        ...prevProfile!,
        full_name: formData.name.trim(),
        name: formData.name.trim(), // Keep both for compatibility
        email: formData.email.trim(),
        updated_at: new Date().toISOString()
      }));

      // Update the form data to match the saved data
      setFormData({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      // console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Navbar />
        <Container
          component="main"
          maxWidth="md"
          sx={{
            flexGrow: 1,
            mt: { xs: 8, sm: 10 },
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading profile...
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Navbar />
        <Container
          component="main"
          maxWidth="md"
          sx={{
            flexGrow: 1,
            mt: { xs: 8, sm: 10 },
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Profile Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Unable to load your profile information.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Navbar />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          flexGrow: 1,
          mt: { xs: 8, sm: 10 },
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: mode === 'dark' ? 'white' : 'text.primary',
              mb: 2,
            }}
          >
            My Profile
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              mb: 0,
              fontWeight: 400,
              opacity: 0.8,
            }}
          >
            Manage your account information and preferences
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Overview Card */}
          <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                  border: '4px solid',
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              >
                {(profile?.full_name || profile?.name) ? (profile.full_name || profile.name).charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                {profile?.full_name || profile?.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3, fontSize: '1rem' }}>
                {profile?.email || ''}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  bgcolor: profile.role.name === 'admin' ? 'error.light' : 'success.light',
                  color: profile.role.name === 'admin' ? 'error.contrastText' : 'success.contrastText',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <CheckCircle sx={{ fontSize: '1.1rem' }} />
                {profile.role.name}
              </Box>
            </Paper>
          </Box>

          {/* Profile Details Card */}
          <Box sx={{ flex: { xs: '1', md: '0 0 66.666%' } }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #42a5f5, #1976d2)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Profile Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal details and account settings
                  </Typography>
                </Box>
                {!isEditing ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    variant="outlined"
                    size="medium"
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      variant="outlined"
                      size="medium"
                      disabled={isSaving}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={isSaving ? <CircularProgress size={16} /> : <Save />}
                      onClick={handleSave}
                      variant="contained"
                      size="medium"
                      disabled={isSaving}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 4 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Person sx={{ fontSize: '1.2rem' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Full Name
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                      size="medium"
                      placeholder="Enter your full name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                      {profile?.full_name || profile?.name || 'Not set'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'secondary.light',
                        color: 'secondary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Email sx={{ fontSize: '1.2rem' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Email Address
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      variant="outlined"
                      size="medium"
                      placeholder="Enter your email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                      {profile?.email || ''}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'warning.light',
                        color: 'warning.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Security sx={{ fontSize: '1.2rem' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Account Type
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', minHeight: '2.5rem', display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
                    {profile.role.name}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'info.light',
                        color: 'info.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CalendarToday sx={{ fontSize: '1.2rem' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Member Since
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                    {formatDate(profile.created_at)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Security sx={{ fontSize: '1.2rem' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Account Security
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Your account is secured with industry-standard encryption and follows best security practices.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Last updated: {formatDate(profile.updated_at)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
