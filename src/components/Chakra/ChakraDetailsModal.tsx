'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Fade,
  Slide,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { ChakraPoint } from '@/types/chakra';

interface ChakraDetailsModalProps {
  open: boolean;
  onClose: () => void;
  chakraPoint: ChakraPoint | null;
}

export const ChakraDetailsModal: React.FC<ChakraDetailsModalProps> = ({
  open,
  onClose,
  chakraPoint
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!chakraPoint) return null;

  const getStatusColor = () => {
    if (chakraPoint.should_avoid) return 'error';
    if (chakraPoint.is_auspicious) return 'success';
    return 'warning';
  };

  const getStatusText = () => {
    if (chakraPoint.should_avoid) return 'Avoid';
    if (chakraPoint.is_auspicious) return 'Auspicious';
    return 'Neutral';
  };

  const getStatusIcon = () => {
    if (chakraPoint.should_avoid) return <WarningIcon sx={{ fontSize: 20 }} />;
    if (chakraPoint.is_auspicious) return <CheckCircleIcon sx={{ fontSize: 20 }} />;
    return <InfoIcon sx={{ fontSize: 20 }} />;
  };

  const getStatusGradient = () => {
    if (chakraPoint.should_avoid) return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
    if (chakraPoint.is_auspicious) return 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
    return 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '90vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          backdropFilter: 'blur(20px)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          pb: 3,
          pt: 3,
          px: 3,
          background: getStatusGradient(),
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 28, opacity: 0.9 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {chakraPoint.name}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                zIndex: 1,
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500, letterSpacing: '0.02em', mb: 2 }}>
            {chakraPoint.direction} • {chakraPoint.id}
          </Typography>
          
          {/* Status Chip positioned in header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              color={getStatusColor()}
              variant="filled"
              sx={{ 
                fontWeight: 700,
                fontSize: '0.9rem',
                height: 36,
                px: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '& .MuiChip-icon': {
                  color: 'white',
                }
              }}
            />
            {chakraPoint.should_avoid && (
              <Chip
                label="Not Recommended"
                color="error"
                variant="outlined"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  height: 32,
                  borderWidth: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.error.main,
                    color: 'white',
                  }
                }}
              />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: 3 }}>
        {/* Row 1: Image and Remedies side by side */}
        <Fade in timeout={600}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' }
          }}>
            {/* Image Section */}
            <Box sx={{ 
              flex: 1,
              display: 'flex', 
              justifyContent: 'center',
              minWidth: { xs: '100%', md: '300px' }
            }}>
              {chakraPoint.image_url ? (
                <Box
                  component="img"
                  src={chakraPoint.image_url}
                  alt={`${chakraPoint.name} - ${chakraPoint.direction}`}
                  sx={{
                    width: { xs: 250, md: 300 },
                    height: 200,
                    borderRadius: 3,
                    objectFit: 'cover',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    border: theme.palette.mode === 'dark' 
                      ? '2px solid rgba(255, 255, 255, 0.1)'
                      : '2px solid rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    }
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: 250, md: 300 },
                    height: 200,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                      : 'linear-gradient(145deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)',
                    border: theme.palette.mode === 'dark' 
                      ? '2px dashed rgba(255, 255, 255, 0.2)'
                      : '2px dashed rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 32, opacity: 0.5 }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    No image available
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Remedies Section */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
              <Card
                sx={{
                  height: '100%',
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    : 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: 2,
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Recommended Remedies
                    </Typography>
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      flex: 1,
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 2,
                      border: theme.palette.mode === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : '1px solid rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '2px 2px 0 0',
                      }
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7, 
                        textAlign: 'justify',
                        fontSize: '1.05rem',
                        color: theme.palette.text.primary,
                        fontWeight: 400,
                      }}
                    >
                      {chakraPoint.remedies}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Fade>

        {/* Row 2: Description in its own row */}
        <Fade in timeout={800}>
          <Card
            sx={{
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                : 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                  }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Description
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.7, 
                  textAlign: 'justify',
                  fontSize: '1.05rem',
                  color: theme.palette.text.primary,
                  fontWeight: 400,
                }}
              >
                {chakraPoint.description}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </DialogContent>

    </Dialog>
  );
};

export default ChakraDetailsModal;
