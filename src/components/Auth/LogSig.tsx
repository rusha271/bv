"use client";

import React, { useState, useEffect, memo } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Stack,
  Link,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person, 
  Phone 
} from '@mui/icons-material';
import { useDeviceType } from '../../utils/useDeviceType';
import { useLegal } from '../../contexts/LegalContent';
import { LegalDocument } from '../Policies/LegalDocument';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useAuthActions } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/utils/permissions';

// TypeScript Interfaces
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

interface LogSigProps {
  open: boolean;
  onClose: () => void;
  prefillData?: Partial<FormData>;
  redirectUrl?: string;
}

// Yup Validation Schemas
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(12, 'Password must be at least 12 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number & special character (@$!%*?&)'
    )
    .required('Password is required'),
});

const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters long')
    .matches(/^\S+$/, 'Please use underscores or camelCase instead of spaces (e.g., John_Doe or JohnDoe)')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[\d\s-()]{10,15}$/, 'Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)')
    .optional(),
  password: Yup.string()
    .min(12, 'Password must be at least 12 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number & special character (@$!%*?&)'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

// Validation Functions
const validateField = async (
  field: string,
  value: string,
  formData: FormData,
  isSignup: boolean
): Promise<string | null> => {
  try {
    const schema = isSignup ? signupSchema : loginSchema;
    await schema.validateAt(field, formData);
    return null;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

const validateForm = async (formData: FormData, isSignup: boolean) => {
  try {
    const schema = isSignup ? signupSchema : loginSchema;
    await schema.validate(formData, { abortEarly: false });
    return { errors: {}, isValid: true };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors: { [key: string]: string } = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { errors, isValid: false };
    }
    return { errors: { general: 'Validation failed' }, isValid: false };
  }
};

// TabPanel Component
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Login/Signup Component
const LogSig = memo(function LogSig({ 
  open, 
  onClose, 
  redirectUrl, 
  prefillData = {} 
}: LogSigProps) {
  const { isMobile } = useDeviceType();
  const { showTerms, showPrivacy, setShowTerms, setShowPrivacy } = useLegal();
  const theme = useTheme();
  const router = useRouter();
  const { login: authLogin, register: authRegister } = useAuthActions();

  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: prefillData?.email || '',
    password: prefillData?.password || '',
    confirmPassword: prefillData?.confirmPassword || '',
    fullName: prefillData?.fullName || '',
    phone: prefillData?.phone || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  // Reusable theme-aware styles
  const getTextFieldStyles = () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      background: theme.palette.mode === 'dark' 
        ? 'rgba(15, 23, 42, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: theme.palette.mode === 'dark'
        ? '1px solid rgba(148, 163, 184, 0.2)'
        : '1px solid rgba(102, 126, 234, 0.1)',
      color: theme.palette.text.primary,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.4)'
          : '1px solid rgba(102, 126, 234, 0.3)',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)',
        transform: 'translateY(-1px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 15px rgba(0, 0, 0, 0.2)'
          : '0 4px 15px rgba(102, 126, 234, 0.1)',
      },
      '&.Mui-focused': {
        border: '2px solid #667eea',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: '#667eea',
    },
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(0, 0, 0, 0.6)',
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setErrors({});
    setFormData({
      email: prefillData?.email || '',
      password: '',
      confirmPassword: '',
      fullName: prefillData?.fullName || '',
      phone: prefillData?.phone || '',
    });
  };

  // Emit modal state changes for SmartPageLoader
  useEffect(() => {
    if (open) {
      const eventType = tabValue === 0 ? 'loginModalStateChange' : 'signupModalStateChange';
      window.dispatchEvent(new CustomEvent(eventType, { 
        detail: { type: tabValue === 0 ? 'login' : 'signup', isOpen: true } 
      }));
    } else {
      // Emit close events for both login and signup
      window.dispatchEvent(new CustomEvent('loginModalStateChange', { 
        detail: { type: 'login', isOpen: false } 
      }));
      window.dispatchEvent(new CustomEvent('signupModalStateChange', { 
        detail: { type: 'signup', isOpen: false } 
      }));
    }
  }, [open, tabValue]);

  useEffect(() => {
    // Remove console.log to prevent unnecessary renders
  }, []);

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleFieldValidation = async (field: keyof FormData) => {
    const error = await validateField(field, formData[field], formData, tabValue === 1);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const isSignup = tabValue === 1;
    const validation = await validateForm(formData, isSignup);
    setErrors(validation.errors);
  
    if (!validation.isValid) return;
  
    try {
      if (isSignup) {
        await authRegister(formData.fullName, formData.email, formData.password, rememberMe);
        toast.success('Signup successful!');
        router.push(redirectUrl || '/');
      } else {
        // console.log('Sending login request:', { email: formData.email });
        await authLogin(formData.email, formData.password, rememberMe);
        // console.log('Login successful');
        toast.success('Login successful!');
        
        // Close the login modal without redirecting
        // The user will stay on the current page
        onClose();
        
        // Optional: Only redirect if a specific redirectUrl is provided
        // This allows for intentional redirects (like from protected routes)
        if (redirectUrl && redirectUrl !== '/') {
          setTimeout(() => {
            router.push(redirectUrl);
          }, 100);
        }
      }
    } catch (error: any) {
      // console.error('API Error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to authenticate. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            overflow: 'hidden',
            maxHeight: isMobile ? '100vh' : '90vh',
            boxShadow: isMobile 
              ? 'none' 
              : theme.palette.mode === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(15, 23, 42, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
              color: 'white',
              textAlign: 'center',
              py: isMobile ? 3 : 4,
              px: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
              },
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 12,
                top: 12,
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                fontWeight="800" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #fff 0%, #f0f0f0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                ✨ Brahma Vastu
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.95,
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                Welcome to your Vastu journey
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: isMobile ? 2 : 4, overflowY: 'auto' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: 3,
              p: 0.5,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: isMobile ? '0.9rem' : '1rem',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(102, 126, 234, 0.7)',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-1px)',
                  color: theme.palette.mode === 'dark' ? 'white' : '#667eea',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <TabPanel value={tabValue} index={0}>
              <Stack spacing={isMobile ? 2.5 : 3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={() => handleFieldValidation('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={() => handleFieldValidation('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                        '& .MuiSvgIcon-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{ 
                    alignSelf: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#667eea',
                    }
                  }}
                />

                <Box textAlign="right">
                  <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#667eea', 
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: theme.palette.mode === 'dark' ? 'white' : '#5a6fd8',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  disabled={false}
                  sx={{
                    borderRadius: 3,
                    py: isMobile ? 1.2 : 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    fontWeight: 700,
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={isMobile ? 2.5 : 3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  onBlur={() => handleFieldValidation('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName || 'Enter your name without spaces (e.g., John_Doe or JohnDoe)'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={() => handleFieldValidation('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  onBlur={() => handleFieldValidation('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone || 'Enter your phone number (e.g., +1234567890 or 123-456-7890)'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={() => handleFieldValidation('password')}
                  error={!!errors.password}
                  helperText={errors.password || 'Must be 12+ characters with uppercase, lowercase, number & special character'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  onBlur={() => handleFieldValidation('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={getTextFieldStyles()}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  disabled={false}
                  sx={{
                    borderRadius: 3,
                    py: isMobile ? 1.2 : 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    fontWeight: 700,
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            </TabPanel>
          </form>

          {/* <SocialAuth setFormData={setFormData} setTabValue={setTabValue} /> */}

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              By continuing, you agree to our{' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#667eea', 
                  textDecoration: 'none', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.mode === 'dark' ? 'white' : '#5a6fd8',
                    textDecoration: 'underline',
                  }
                }}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#667eea', 
                  textDecoration: 'none', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.mode === 'dark' ? 'white' : '#5a6fd8',
                    textDecoration: 'underline',
                  }
                }}
              >
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <LegalDocument type="terms" open={showTerms} onClose={() => setShowTerms(false)} />
      <LegalDocument type="privacy" open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
});

export default LogSig;