import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  Divider,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import { X, Shield, FileText, Eye, Lock, Users, AlertCircle } from 'lucide-react';
import { useDeviceType } from '../../utils/useDeviceType';

interface LegalDocumentProps {
  type: 'terms' | 'privacy';
  open: boolean;
  onClose: () => void;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ type, open, onClose }) => {
  const { isMobile } = useDeviceType();
  const theme = useTheme();

  const getTitle = () => {
    return type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  };

  const getIcon = () => {
    return type === 'terms' ? <FileText size={24} /> : <Shield size={24} />;
  };

  const getDescription = () => {
    return type === 'terms' 
      ? 'Please read these terms carefully before using our service'
      : 'Learn how we collect, use, and protect your personal information';
  };

  const getContent = () => {
    if (type === 'terms') {
      return (
        <Stack spacing={isMobile ? 2 : 2.5}>
          {/* Introduction */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: isMobile ? 2 : 2.5, 
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(59, 130, 246, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: 3
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={20} color="white" />
              </Box>
        <Box>
                <Typography variant="h6" fontWeight="700" sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
            Terms of Service
          </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date().toLocaleDateString()}
          </Typography>
              </Box>
            </Stack>
            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
              Welcome to Brahma Vastu! These terms govern your use of our Vastu analysis platform. 
              By accessing or using our services, you agree to be bound by these terms.
          </Typography>
          </Paper>

          {/* Terms Sections */}
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing and using Brahma Vastu, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.",
              icon: <AlertCircle size={18} />
            },
            {
              title: "2. Service Description",
              content: "Brahma Vastu provides Vastu Shastra analysis services, including floor plan analysis, chakra point identification, and personalized recommendations. Our services are for informational purposes and should not replace professional architectural or spiritual guidance.",
              icon: <Eye size={18} />
            },
            {
              title: "3. User Responsibilities",
              content: "You are responsible for providing accurate information, maintaining the confidentiality of your account, and using our services in compliance with applicable laws. You agree not to misuse our platform or attempt to gain unauthorized access.",
              icon: <Users size={18} />
            },
            {
              title: "4. Intellectual Property",
              content: "All content, features, and functionality of Brahma Vastu are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.",
              icon: <Lock size={18} />
            },
            {
              title: "5. Limitation of Liability",
              content: "Brahma Vastu provides services 'as is' without warranties. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.",
              icon: <Shield size={18} />
            }
          ].map((section, index) => (
            <Paper 
              key={index}
              elevation={0} 
              sx={{ 
                p: isMobile ? 2 : 2.5, 
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(15, 23, 42, 0.5)'
                  : 'rgba(255, 255, 255, 0.7)',
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(148, 163, 184, 0.1)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.5
                }}>
                  {section.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1.5, color: 'text.primary' }}>
                    {section.title}
          </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {section.content}
          </Typography>
        </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      );
    } else {
      return (
        <Stack spacing={isMobile ? 2 : 2.5}>
          {/* Introduction */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: isMobile ? 2 : 2.5, 
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(34, 197, 94, 0.2)'
                : '1px solid rgba(34, 197, 94, 0.1)',
              borderRadius: 3
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={20} color="white" />
              </Box>
        <Box>
                <Typography variant="h6" fontWeight="700" sx={{ 
                  background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
            Privacy Policy
          </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date().toLocaleDateString()}
          </Typography>
              </Box>
            </Stack>
            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
              Your privacy is important to us. This policy explains how Brahma Vastu collects, uses, 
              and protects your personal information when you use our services.
          </Typography>
          </Paper>

          {/* Privacy Sections */}
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly (name, email, phone), usage data (how you interact with our services), and technical data (IP address, browser type, device information). We also collect floor plan images and analysis data you upload.",
              icon: <Eye size={18} />
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your information to provide Vastu analysis services, improve our platform, communicate with you, ensure security, and comply with legal obligations. We may use aggregated data for research and development purposes.",
              icon: <Users size={18} />
            },
            {
              title: "3. Information Sharing",
              content: "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our platform, and we may disclose information if required by law or to protect our rights.",
              icon: <Lock size={18} />
            },
            {
              title: "4. Data Security",
              content: "We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
              icon: <Shield size={18} />
            },
            {
              title: "5. Your Rights",
              content: "You have the right to access, update, or delete your personal information. You can opt out of marketing communications, request data portability, and withdraw consent for data processing. Contact us to exercise these rights.",
              icon: <FileText size={18} />
            }
          ].map((section, index) => (
            <Paper 
              key={index}
              elevation={0} 
              sx={{ 
                p: isMobile ? 2 : 2.5, 
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(15, 23, 42, 0.5)'
                  : 'rgba(255, 255, 255, 0.7)',
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(148, 163, 184, 0.1)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 0.5
                }}>
                  {section.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1.5, color: 'text.primary' }}>
                    {section.title}
          </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {section.content}
          </Typography>
        </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxHeight: isMobile ? '100vh' : '90vh',
          boxShadow: theme.palette.mode === 'dark'
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
            background: type === 'terms' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)',
            color: 'white',
            textAlign: 'center',
            py: isMobile ? 2.5 : 3,
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
            <X size={20} />
          </IconButton>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon()}
              </Box>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                fontWeight="800" 
                sx={{
                  background: 'linear-gradient(45deg, #fff 0%, #f0f0f0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
            {getTitle()}
          </Typography>
            </Stack>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.95,
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              {getDescription()}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: isMobile ? 2 : 3, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}>
        {getContent()}
      </DialogContent>

      <DialogActions sx={{ 
        p: isMobile ? 2 : 2.5,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: theme.palette.mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          size="large"
          sx={{
            borderRadius: 3,
            py: 1.5,
            background: type === 'terms' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
            boxShadow: type === 'terms' 
              ? '0 8px 25px rgba(102, 126, 234, 0.3)'
              : '0 8px 25px rgba(34, 197, 94, 0.3)',
            fontWeight: 700,
            fontSize: '1.1rem',
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: type === 'terms' 
                ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                : 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)',
              transform: 'translateY(-2px)',
              boxShadow: type === 'terms' 
                ? '0 12px 35px rgba(102, 126, 234, 0.4)'
                : '0 12px 35px rgba(34, 197, 94, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          }}
        >
          ✨ Got it, thanks!
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 