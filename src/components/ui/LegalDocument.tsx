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
} from '@mui/material';
import { X } from 'lucide-react';
import { useDeviceType } from '../../utils/useDeviceType';

interface LegalDocumentProps {
  type: 'terms' | 'privacy';
  open: boolean;
  onClose: () => void;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ type, open, onClose }) => {
  const { isMobile } = useDeviceType();

  const getTitle = () => {
    return type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  };

  const getContent = () => {
    if (type === 'terms') {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            Terms of Service
          </Typography>
          <Typography variant="body2" paragraph>
            Welcome to Brahma Vastu. By using our service, you agree to these terms.
          </Typography>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" paragraph>
            By accessing and using Brahma Vastu, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>
          <Typography variant="h6" gutterBottom>
            2. Use License
          </Typography>
          <Typography variant="body2" paragraph>
            Permission is granted to temporarily download one copy of the materials on Brahma Vastu's website for personal, non-commercial transitory viewing only.
          </Typography>
          <Typography variant="h6" gutterBottom>
            3. Disclaimer
          </Typography>
          <Typography variant="body2" paragraph>
            The materials on Brahma Vastu's website are provided on an 'as is' basis. Brahma Vastu makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>
          <Typography variant="h6" gutterBottom>
            4. Limitations
          </Typography>
          <Typography variant="body2" paragraph>
            In no event shall Brahma Vastu or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Brahma Vastu's website.
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            This Privacy Policy describes how Brahma Vastu collects, uses, and protects your information.
          </Typography>
          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body2" paragraph>
            We collect information you provide directly to us, such as when you create an account, contact us, or use our services.
          </Typography>
          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body2" paragraph>
            We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure security.
          </Typography>
          <Typography variant="h6" gutterBottom>
            3. Information Sharing
          </Typography>
          <Typography variant="body2" paragraph>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </Typography>
          <Typography variant="h6" gutterBottom>
            4. Data Security
          </Typography>
          <Typography variant="body2" paragraph>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>
          <Typography variant="h6" gutterBottom>
            5. Your Rights
          </Typography>
          <Typography variant="body2" paragraph>
            You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
          </Typography>
        </Box>
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
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '80vh',
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            color: 'white',
            textAlign: 'center',
            py: isMobile ? 2 : 3,
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
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
            {getTitle()}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 2 : 3, overflowY: 'auto' }}>
        {getContent()}
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 