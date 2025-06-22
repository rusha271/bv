"use client"

import React, { useState } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ThemeSwitcher from './ThemeSwitcher';
import LogSigComponent from './LogSig';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '#' },
];

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const { mode, toggleTheme, theme } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginClose = () => {
    setLoginDialogOpen(false);
  };

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
              <Image
                src="/images/bv.png"
                alt="Brahma Vastu"
                width={48}
                height={48}
                style={{ borderRadius: 8 }}
                priority
              />
              <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                Brahma Vastu
              </Typography>
            </Box>
            <Box display={{ xs: 'none', md: 'flex' }} gap={2} alignItems="center">
              {menuItems.map((item) => (
                <Button key={item.label} href={item.href} sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                  {item.label}
                </Button>
              ))}
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
              <ThemeSwitcher toggleTheme={toggleTheme} mode={mode} />
            </Box>
            <Box display={{ xs: 'flex', md: 'none' }}>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 220, p: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                  <List>
                    {menuItems.map((item) => (
                      <ListItem key={item.label} disablePadding>
                        <ListItemButton component="a" href={item.href}>
                          <ListItemText primary={item.label} sx={{ color: theme.palette.text.primary }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLoginClick}>
                        <ListItemText primary="Log in" sx={{ color: theme.palette.text.primary }} />
                      </ListItemButton>
                    </ListItem>
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
      
      <LogSigComponent open={loginDialogOpen} onClose={handleLoginClose} />
    </>
  );
}