"use client";

import React, { useState } from 'react';
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
} from '@mui/material';
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useDeviceType } from '../../utils/useDeviceType';
import { useLegal } from '../../contexts/LegalContent';
import { LegalDocument } from './LegalDocument';
import { SocialAuth } from './AuthComponent';

// TypeScript Interfaces
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    email?: boolean;
    min?: number;
    pattern?: RegExp;
    oneOf?: string[];
    message?: string;
  };
}

interface LogSigProps {
  open: boolean;
  onClose: () => void;
  prefillData?: Partial<FormData>;
}

// Validation Functions
const createValidationSchema = (isSignup = false): ValidationSchema => {
  const schema: ValidationSchema = {
    email: {
      required: true,
      email: true,
      message: 'Please enter a valid email address',
    },
    password: {
      required: true,
      min: 6,
      message: 'Password must be at least 6 characters long',
    },
  };

  if (isSignup) {
    schema.fullName = {
      required: true,
      min: 2,
      message: 'Full name must be at least 2 characters long',
    };
    schema.confirmPassword = {
      required: true,
      oneOf: ['password'],
      message: 'Passwords must match',
    };
    schema.phone = {
      required: false,
      pattern: /^[+]?[\d\s-()]{10,15}$/,
      message: 'Please enter a valid phone number',
    };
  }

  return schema;
};

const validateField = (field: string, value: string, schema: ValidationSchema, formData: FormData): string | null => {
  const fieldSchema = schema[field];
  if (!fieldSchema) return null;

  if (fieldSchema.required && (!value || value.trim() === '')) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  }

  if (value) {
    if (fieldSchema.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return fieldSchema.message || 'Invalid email format';
    }

    if (fieldSchema.min && value.length < fieldSchema.min) {
      return fieldSchema.message || `Must be at least ${fieldSchema.min} characters`;
    }

    if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
      return fieldSchema.message || 'Invalid format';
    }

    if (fieldSchema.oneOf && fieldSchema.oneOf.includes('password')) {
      if (value !== formData.password) {
        return fieldSchema.message || 'Values do not match';
      }
    }
  }

  return null;
};

const validateForm = (formData: FormData, isSignup: boolean) => {
  const schema = createValidationSchema(isSignup);
  const errors: { [key: string]: string } = {};

  Object.keys(schema).forEach((field) => {
    const error = validateField(field, formData[field as keyof FormData], schema, formData);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
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
export default function LogSigComponent({ open, onClose, prefillData }: LogSigProps) {
  const { isMobile } = useDeviceType();
  const { showTerms, showPrivacy, setShowTerms, setShowPrivacy } = useLegal();

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

  const handleFieldValidation = (field: keyof FormData) => {
    const validation = validateForm(formData, tabValue === 1);
    if (validation.errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validation.errors[field],
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

    const validation = validateForm(formData, tabValue === 1);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(tabValue === 0 ? 'Login successful!' : 'Account created successfully!');
      onClose();
    }, 1500);
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
              <X size={20} />
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
                        <Mail size={20} color="#666" />
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
                        <Lock size={20} color="#666" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  {isLoading ? 'Signing In...' : 'Sign In'}
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
                  helperText={errors.fullName}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} color="#666" />
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
                        <Mail size={20} color="#666" />
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
                  helperText={errors.phone}
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} color="#666" />
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
                        <Lock size={20} color="#666" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                        <Lock size={20} color="#666" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

          <SocialAuth setFormData={setFormData} setTabValue={setTabValue} />

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