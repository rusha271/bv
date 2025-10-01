'use client';

import React, { useState } from 'react';
import { useAuthUser, useAuthGuest } from '@/contexts/AuthContext';
import LogSigComponent from '../Auth/LogSig';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Stack, 
  Chip,
  useTheme,
  Slide,
  Fade
} from '@mui/material';
import { 
  Crown, 
  X, 
  Star, 
  Shield, 
  Zap,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useDeviceType } from '@/utils/useDeviceType';

export default function GuestBanner() {
  const isGuest = useAuthGuest();
  const user = useAuthUser();
  const [showBanner, setShowBanner] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { isMobile } = useDeviceType();

  // Debug logging
  React.useEffect(() => {
    // console.log('GuestBanner Debug:', {
    //   isGuest,
    //   user: user ? { name: user.name, email: user.email, role: user.role } : null,
    //   showBanner,
    //   bannerDismissed: typeof window !== 'undefined' ? sessionStorage.getItem('guest_banner_dismissed') : 'N/A',
    //   guestAccountCreated: typeof window !== 'undefined' ? sessionStorage.getItem('guest_account_created') : 'N/A',
    //   debugMode: typeof window !== 'undefined' ? window.location.search.includes('debug=banner') : false,
    //   willShow: isGuest && showBanner
    // });
  }, [isGuest, user, showBanner]);

  // Check if banner was dismissed
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const bannerDismissed = sessionStorage.getItem('guest_banner_dismissed');
      // console.log('Banner dismissed check:', bannerDismissed);
      
      // If banner was dismissed but we have a new guest account, reset the banner
      if (bannerDismissed === 'true' && isGuest) {
        const guestAccountCreated = sessionStorage.getItem('guest_account_created');
        if (guestAccountCreated === 'true') {
          // console.log('Resetting banner for new guest account');
          sessionStorage.removeItem('guest_banner_dismissed');
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }
      } else if (bannerDismissed === 'true') {
        setShowBanner(false);
      }
    }
  }, [isGuest]);

  // Listen for custom event to open upgrade modal
  React.useEffect(() => {
    const handleOpenUpgrade = () => {
      setShowUpgradeModal(true);
    };

    window.addEventListener('openGuestUpgrade', handleOpenUpgrade);
    return () => {
      window.removeEventListener('openGuestUpgrade', handleOpenUpgrade);
    };
  }, []);

  // Always render the same structure to prevent hydration mismatch
  // Use opacity and visibility to hide/show content instead of conditional rendering

  // Temporary debug mode - force banner to show for testing
  const debugMode = typeof window !== 'undefined' && window.location.search.includes('debug=banner');
  
  // Debug: Add manual guest account creation button
  const handleCreateGuestAccount = async () => {
    try {
      // console.log('Manually creating guest account...');
      // Trigger guest account creation via custom event
      window.dispatchEvent(new CustomEvent('createGuestAccount'));
    } catch (error) {
      // console.error('Failed to create guest account manually:', error);
    }
  };

  // Debug: Reset banner state
  const handleResetBanner = () => {
    //  console.log('Resetting banner state...');
    sessionStorage.removeItem('guest_banner_dismissed');
    setShowBanner(true);
  };
  
  // Determine if banner should be visible
  const shouldShowBanner = (isGuest && showBanner) || debugMode;

  return (
    <>
      <Slide direction="up" in={shouldShowBanner} timeout={500}>
        <Box
          sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
            zIndex: 1200,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 -8px 32px rgba(0, 0, 0, 0.3)'
              : '0 -8px 32px rgba(0, 0, 0, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                : 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              pointerEvents: 'none',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              maxWidth: '1200px', 
              mx: 'auto', 
              px: { xs: 1, sm: 3, md: 4 },
              py: { xs: 0.5, sm: 2, md: 2.5 }
            }}>
              <Stack 
                direction="row" 
                spacing={{ xs: 1, sm: 2 }}
                alignItems="center"
                justifyContent="space-between"
                sx={{ minHeight: { xs: '40px', sm: 'auto' } }}
              >
                {/* Left side - Message */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 0.5, sm: 1 },
                  flex: 1,
                  minWidth: 0
                }}>
                  <Box sx={{ 
                    p: { xs: 0.3, sm: 0.4 }, 
                    borderRadius: 1, 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Crown size={isMobile ? 10 : 14} color="white" />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white',
                      fontSize: { xs: '0.7rem', sm: '0.85rem' },
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    👋 Welcome, {user?.name || 'Guest'}!
                  </Typography>
                </Box>

                {/* Features preview - Desktop only */}
                {!isMobile && (
                  <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                    <Chip
                      icon={<Shield size={14} />}
                      label="Save Progress"
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '& .MuiChip-icon': { color: 'white' },
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                    <Chip
                      icon={<Zap size={14} />}
                      label="All Features"
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '& .MuiChip-icon': { color: 'white' },
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                    <Chip
                      icon={<Star size={14} />}
                      label="Premium"
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '& .MuiChip-icon': { color: 'white' },
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </Stack>
                )}

                {/* Right side - Actions */}
                <Stack 
                  direction="row" 
                  spacing={{ xs: 0.5, sm: 1 }} 
                  alignItems="center"
                  sx={{ 
                    flexShrink: 0
                  }}
                >
                  <Button
              onClick={() => setShowUpgradeModal(true)}
                    variant="contained"
                    size="small"
                    startIcon={<Sparkles size={isMobile ? 10 : 16} />}
                    endIcon={<ArrowUpRight size={isMobile ? 10 : 16} />}
                    sx={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: 'white',
                      borderRadius: 2,
                      px: { xs: 0.8, sm: 2.5 },
                      py: { xs: 0.4, sm: 1 },
                      fontWeight: 700,
                      fontSize: { xs: '0.65rem', sm: '0.85rem' },
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                      minWidth: 'auto'
                    }}
                  >
                    {isMobile ? 'Upgrade' : 'Upgrade Now'}
                  </Button>

                  <IconButton
              onClick={() => {
                sessionStorage.setItem('guest_banner_dismissed', 'true');
                setShowBanner(false);
              }}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s ease',
                      width: { xs: '24px', sm: '32px' },
                      height: { xs: '24px', sm: '32px' }
                    }}
              aria-label="Close banner"
            >
                    <X size={isMobile ? 10 : 16} />
                  </IconButton>
                </Stack>
              </Stack>

              {/* Debug mode content */}
              {debugMode && (
                <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    DEBUG: isGuest={isGuest ? 'true' : 'false'}, showBanner={showBanner ? 'true' : 'false'}
                  </Typography>
                  <Button
                    onClick={handleResetBanner}
                    size="small"
                    sx={{ 
                      ml: 2, 
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                    }}
                  >
                    Reset Banner
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Slide>

      {showUpgradeModal && (
        <LogSigComponent open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      )}
    </>
  );
}
