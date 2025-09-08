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

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
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
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
      console.log('Using full URL:', imagePath);
      return imagePath;
    }
    // If the path doesn't start with http, it's likely a relative path from the API
    // We need to construct the full URL using the same base URL as the apiService
    const baseURL = apiService.getBaseURL();
    const fullUrl = imagePath.startsWith('/') ? `${baseURL}${imagePath}` : `${baseURL}/${imagePath}`;
    console.log('Constructed URL:', fullUrl, 'from path:', imagePath, 'baseURL:', baseURL);
    return fullUrl;
  };

  useEffect(() => {
    // Fetch uploaded logo
    const fetchUploadedLogo = async () => {
      try {
        const data = await apiService.admin.getLogo();
        console.log('Logo data received:', data);
        console.log('Image URL:', data.image_url);
        setUploadedLogo(data.image_url);
      } catch (error) {
        console.error('Error fetching uploaded logo:', error);
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={6}
          sx={{
            boxShadow: 6,
            borderBottom: theme.palette.mode === 'dark' ? '1.5px solid #23234f' : '1.5px solid #e5e7eb',
            background: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
            color: theme.palette.text.primary,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={2}>
              {uploadedLogo && (
                <Image
                  src={getImageUrl(uploadedLogo)}
                  alt="Uploaded Logo"
                  width={48}
                  height={48}
                  style={{ borderRadius: 8 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
                Brahma Vastu
              </Typography>
            </Box>
            <Box display={{ xs: 'none', md: 'flex' }} gap={2} alignItems="center">
              {menuItems.map((item) => (
                <Button key={item.label} onClick={() => router.push(item.href)} sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                  {item.label}
                </Button>
              ))}
              {isAdmin && (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  sx={{ 
                    color: theme.palette.text.primary, 
                    fontWeight: 600,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
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
                       border: `2px solid ${theme.palette.primary.main}`,
                       '&:hover': {
                         borderColor: theme.palette.primary.dark,
                       },
                     }}
                   >
                     <Avatar
                       sx={{
                         width: 36,
                         height: 36,
                         bgcolor: theme.palette.primary.main,
                         color: theme.palette.primary.contrastText,
                         fontSize: '0.9rem',
                         fontWeight: 600,
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
                    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.contrastText,
                    background: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
                    fontWeight: 600,
                    ml: 2,
                    px: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                      color: '#fff',
                    },
                  }}
                >
                  Log in
                </Button>
              )}
              <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
            </Box>
            <Box display={{ xs: 'flex', md: 'none' }}>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 220, p: 2 }} role="presentation">
                  <List>
                    {menuItems.map((item) => (
                      <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => {
                          router.push(item.href);
                          setDrawerOpen(false);
                        }}>
                          <ListItemText primary={item.label} sx={{ color: theme.palette.text.primary }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
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
              minWidth: 200,
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 2,
              border: theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          {isAdmin && (
            <MenuItem onClick={handleDashboardClick}>
              <ListItemIcon>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              Admin Dashboard
            </MenuItem>
          )}
          <MenuItem onClick={handlePaymentsClick}>
            <ListItemIcon>
              <Payment fontSize="small" />
            </ListItemIcon>
            Payments & PDFs
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}

      <LogSigComponent open={loginDialogOpen} onClose={handleLoginClose} redirectUrl={pathname}/>
    </>
  );
});

export default Navbar;