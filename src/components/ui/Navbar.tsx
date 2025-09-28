"use client";

import React, { useState, useEffect, memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import Image from 'next/image';
import { useThemeContext } from '@/contexts/ThemeContext';
import { apiService } from '@/utils/apiService';
import { sessionCache } from '@/utils/apiCache';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ThemeSwitcher from '../ThemeSwitcher';
import LogSigComponent from '../Auth/LogSig';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthUser, useAuthGuest, useAuthActions } from '@/contexts/AuthContext';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dashboard from '@mui/icons-material/Dashboard';
import Payment from '@mui/icons-material/Payment';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import { Sparkles, Home, BookOpen, MessageSquare, Shield } from 'lucide-react';

const menuItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Contact Us', href: '/contact', icon: MessageSquare },
];

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = memo(function Navbar() {
  const router = useRouter();
  const { mode, toggleTheme, theme } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Use selective hooks to prevent unnecessary re-renders
  const user = useAuthUser();
  const isGuest = useAuthGuest();
  const { logout } = useAuthActions();
  
  // Check if user is logged in and is admin
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.role?.name === 'admin';

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      // console.log('Using full URL:', imagePath);
      return imagePath;
    }
    // If the path doesn't start with http, it's likely a relative path from the API
    // We need to construct the full URL using the same base URL as the apiService
    const baseURL = apiService.getBaseURL();
    const fullUrl = imagePath.startsWith('/') ? `${baseURL}${imagePath}` : `${baseURL}/${imagePath}`;
    // console.log('Constructed URL:', fullUrl, 'from path:', imagePath, 'baseURL:', baseURL);
    return fullUrl;
  };

  useEffect(() => {
    // Fetch uploaded logo from site settings with caching
    const fetchUploadedLogo = async () => {
      try {
        // Use the shared cached method to avoid duplicate API calls
        const response = await apiService.siteSettings.getLatestByCategoryCached('logo');
        const logoUrl = response.file_url;
        if (logoUrl) {
          setUploadedLogo(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching uploaded logo:', error);
        // Fallback to old admin API if site settings fails
        try {
          const fallbackData = await apiService.admin.getLogo();
          if (fallbackData?.image_url) {
            setUploadedLogo(fallbackData.image_url);
          }
        } catch (fallbackError) {
          console.error('Fallback logo fetch also failed:', fallbackError);
        }
      }
    };

    fetchUploadedLogo();
  }, []);

  // User menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      // Don't redirect - let user stay on current page
    } catch (error) {
      //  console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    router.push('/profile');
  };

  const handleDashboardClick = () => {
    handleUserMenuClose();
    router.push('/dashboard');
  };

  const handlePaymentsClick = () => {
    handleUserMenuClose();
    router.push('/payments');
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

  // Toggle mobile drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: theme.palette.mode === 'dark' 
              ? '1px solid rgba(148, 163, 184, 0.1)' 
              : '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            color: theme.palette.text.primary,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1300,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      minHeight: 40,
                    }}
                  >
                    <Image
                      src={uploadedLogo ? getImageUrl(uploadedLogo) : "/images/bv.png"}
                      alt="Brahma Vastu Logo"
                      width={32}
                      height={32}
                      style={{ borderRadius: 6 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/bv.png";
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight={800} 
                    onClick={() => router.push('/')} 
                    sx={{ 
                      cursor: 'pointer',
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                        : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        filter: 'brightness(1.1)',
                      }
                    }}
                  >
                    Brahma Vastu
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box 
              display={{ xs: 'none', md: 'flex' }} 
              gap={2} 
              alignItems="center"
            >
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button 
                    key={item.label} 
                    onClick={() => router.push(item.href)} 
                    startIcon={<IconComponent size={18} />}
                    sx={{ 
                      color: theme.palette.text.primary, 
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: 'transparent',
                      '&:hover': {
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(59, 130, 246, 0.05)',
                        transform: 'translateY(-2px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 4px 20px rgba(59, 130, 246, 0.2)'
                          : '0 4px 20px rgba(59, 130, 246, 0.1)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              {isAdmin && (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  startIcon={<Shield size={18} />}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(124, 58, 237, 0.3)'
                      : '0 4px 20px rgba(30, 64, 175, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(124, 58, 237, 0.4)'
                        : '0 8px 30px rgba(30, 64, 175, 0.4)',
                      filter: 'brightness(1.1)',
                    }
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
                             {isAuthenticated && !isGuest ? (
                 <Box display="flex" alignItems="center" gap={1}>
                   <IconButton
                     onClick={handleUserMenuOpen}
                     sx={{
                       p: 0.5,
                       borderRadius: 2,
                       background: theme.palette.mode === 'dark'
                         ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                         : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                       border: theme.palette.mode === 'dark'
                         ? '1px solid rgba(59, 130, 246, 0.3)'
                         : '1px solid rgba(59, 130, 246, 0.2)',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                       '&:hover': {
                         transform: 'scale(1.05)',
                         boxShadow: theme.palette.mode === 'dark'
                           ? '0 4px 20px rgba(59, 130, 246, 0.3)'
                           : '0 4px 20px rgba(59, 130, 246, 0.2)',
                       },
                     }}
                   >
                     <Avatar
                       sx={{
                         width: 32,
                         height: 32,
                         background: theme.palette.mode === 'dark'
                           ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
                           : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                         color: '#fff',
                         fontSize: '0.8rem',
                         fontWeight: 700,
                         boxShadow: theme.palette.mode === 'dark'
                           ? '0 2px 10px rgba(59, 130, 246, 0.3)'
                           : '0 2px 10px rgba(30, 64, 175, 0.3)',
                       }}
                     >
                       {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                     </Avatar>
                   </IconButton>
                 </Box>
               ) : (
                <Button
                  onClick={handleLoginClick}
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(59, 130, 246, 0.3)'
                      : '0 4px 20px rgba(30, 64, 175, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(59, 130, 246, 0.4)'
                        : '0 8px 30px rgba(30, 64, 175, 0.4)',
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Log in
                </Button>
              )}
              <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
            </Box>
            <Box 
              display={{ xs: 'flex', md: 'none' }}
            >
              <IconButton 
                onClick={toggleDrawer}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                  color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1e40af',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(59, 130, 246, 0.3)'
                      : '0 4px 20px rgba(59, 130, 246, 0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer 
                anchor="right" 
                open={drawerOpen} 
                onClose={toggleDrawer}
                PaperProps={{
                  sx: {
                    width: 280,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: theme.palette.mode === 'dark'
                      ? '1px solid rgba(148, 163, 184, 0.1)'
                      : '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box sx={{ width: 280, p: 3 }} role="presentation">
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={800}
                      sx={{
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                          : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Menu
                    </Typography>
                  </Box>
                  <List>
                    {menuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                          <ListItemButton 
                            onClick={() => {
                              router.push(item.href);
                              setDrawerOpen(false);
                            }}
                            sx={{
                              borderRadius: 2,
                              px: 2,
                              py: 1.5,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: theme.palette.mode === 'dark'
                                  ? 'rgba(59, 130, 246, 0.1)'
                                  : 'rgba(59, 130, 246, 0.05)',
                                transform: 'translateX(4px)',
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <IconComponent 
                                size={20} 
                                className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.label} 
                              sx={{ 
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }} 
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                      {isAuthenticated && !isGuest ? (
                       <>
                         <Divider sx={{ my: 1 }} />
                         <ListItem disablePadding>
                           <ListItemButton onClick={() => {
                             handleProfileClick();
                             setDrawerOpen(false);
                           }}>
                             <ListItemIcon>
                               <Person />
                             </ListItemIcon>
                             <ListItemText primary="Profile" sx={{ color: theme.palette.text.primary }} />
                           </ListItemButton>
                         </ListItem>
                         {isAdmin && (
                           <ListItem disablePadding>
                             <ListItemButton onClick={() => {
                               handleDashboardClick();
                               setDrawerOpen(false);
                             }}>
                               <ListItemIcon>
                                 <Dashboard />
                               </ListItemIcon>
                               <ListItemText primary="Admin Dashboard" sx={{ color: theme.palette.text.primary }} />
                             </ListItemButton>
                           </ListItem>
                         )}
                         {!isAdmin && (
                           <ListItem disablePadding>
                             <ListItemButton onClick={() => {
                               handlePaymentsClick();
                               setDrawerOpen(false);
                             }}>
                               <ListItemIcon>
                                 <Payment />
                               </ListItemIcon>
                               <ListItemText primary="Payments & PDFs" sx={{ color: theme.palette.text.primary }} />
                             </ListItemButton>
                           </ListItem>
                         )}
                         <Divider sx={{ my: 1 }} />
                         <ListItem disablePadding>
                           <ListItemButton onClick={() => {
                             handleLogout();
                             setDrawerOpen(false);
                           }}>
                             <ListItemIcon>
                               <Logout />
                             </ListItemIcon>
                             <ListItemText primary="Logout" sx={{ color: theme.palette.text.primary }} />
                           </ListItemButton>
                         </ListItem>
                       </>
                     ) : (
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                          handleLoginClick();
                          setDrawerOpen(false);
                        }}>
                          <ListItemText primary="Log in" sx={{ color: theme.palette.text.primary }} />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </List>
                  <Box mt={2} display="flex" justifyContent="center">
                    <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* User Menu - Only show for non-guest users */}
      {!isGuest && (
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0,0,0,0.4)' 
                : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 3,
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(148, 163, 184, 0.1)' 
                : '1px solid rgba(148, 163, 184, 0.2)',
              overflow: 'hidden',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem 
            onClick={handleProfileClick}
            sx={{
              py: 1.5,
              px: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.05)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Person fontSize="small" className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            </ListItemIcon>
            <Typography fontWeight={600}>Profile</Typography>
          </MenuItem>
          {isAdmin && (
            <MenuItem 
              onClick={handleDashboardClick}
              sx={{
                py: 1.5,
                px: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Dashboard fontSize="small" className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              </ListItemIcon>
              <Typography fontWeight={600}>Admin Dashboard</Typography>
            </MenuItem>
          )}
          {!isAdmin && (
            <MenuItem 
              onClick={handlePaymentsClick}
              sx={{
                py: 1.5,
                px: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Payment fontSize="small" className={theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              </ListItemIcon>
              <Typography fontWeight={600}>Payments & PDFs</Typography>
            </MenuItem>
          )}
          <Divider sx={{ 
            my: 1, 
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(148, 163, 184, 0.1)' 
              : 'rgba(148, 163, 184, 0.2)' 
          }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(239, 68, 68, 0.05)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout fontSize="small" className={theme.palette.mode === 'dark' ? 'text-red-400' : 'text-red-600'} />
            </ListItemIcon>
            <Typography fontWeight={600}>Logout</Typography>
          </MenuItem>
        </Menu>
      )}

      <LogSigComponent open={loginDialogOpen} onClose={handleLoginClose} redirectUrl={pathname}/>
    </>
  );
});

export default Navbar;