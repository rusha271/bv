"use client";

import React, { useState, useEffect } from 'react';
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
import { LegalDocument } from './LegalDocument';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';

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
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
});

const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters long')
    .matches(/^\S+$/, 'Full name cannot contain spaces')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[\d\s-()]{10,15}$/, 'Please enter a valid phone number (10-15 digits)')
    .optional(),
  password: Yup.string()
    .min(12, 'Password must be at least 12 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
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
export default function LogSigComponent({ open, onClose, prefillData, redirectUrl }: LogSigProps) {
  const { isMobile } = useDeviceType();
  const { showTerms, showPrivacy, setShowTerms, setShowPrivacy } = useLegal();
  const theme = useTheme();
  const router = useRouter();
  const { login, register } = useAuth();

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
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

    setIsLoading(true);

    try {
      if (isSignup) {
        await register(formData.fullName, formData.email, formData.password, rememberMe);
        toast.success('Signup successful!');
        router.push(redirectUrl || '/');
      } else {
        console.log('Sending login request:', { email: formData.email });
        await login(formData.email, formData.password, rememberMe);

        console.log('Login successful');

        toast.success('Login successful!');
        router.push(redirectUrl || '/');
      }
      onClose();
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to authenticate. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            borderRadius: isMobile ? 0 : 3,
            overflow: 'hidden',
            maxHeight: isMobile ? '100vh' : '90vh',
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              color: 'white',
              textAlign: 'center',
              py: isMobile ? 3 : 4,
              px: 3,
              position: 'relative',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
              🏠 Brahma Vastu
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Transform your space with ancient wisdom
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: isMobile ? 2 : 4, overflowY: 'auto' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: isMobile ? '0.9rem' : '1rem',
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
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
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
                        <Lock sx={{ color: 'text.secondary' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                  sx={{ 
                    alignSelf: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    }
                  }}
                />

                <Box textAlign="right">
                  <Link href="#" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  disabled={isLoading}
                  sx={{
                    borderRadius: 2,
                    py: isMobile ? 1.2 : 1.5,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                    },
                  }}
                >
                  {isLoading ? 'Signing In' : 'Sign In'}
                </Button>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={isMobile ? 2.5 : 3}>
                <TextField
                  fullWidth
                  label="Full Name (No Spaces)"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  onBlur={() => handleFieldValidation('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName || 'Use underscores or camelCase instead of spaces'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
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
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  onBlur={() => handleFieldValidation('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone || '10-15 digits, can include +, spaces, -, ()'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={() => handleFieldValidation('password')}
                  error={!!errors.password}
                  helperText={errors.password || '12+ chars with uppercase, lowercase, number & symbol'}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
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
                        <Lock sx={{ color: 'text.secondary' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  disabled={isLoading}
                  sx={{
                    borderRadius: 2,
                    py: isMobile ? 1.2 : 1.5,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                    },
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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
                sx={{ color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}
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
                sx={{ color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}
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
}