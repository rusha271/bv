'use client';

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Box, IconButton, useMediaQuery, useTheme, Backdrop } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChakraViewer from "@/components/ui/ChakraViewer";
import DraggableChakraControls from "@/components/ui/DraggableChakraControls";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ChakraOverlayPage() {
  const searchParams = useSearchParams();
  const floorPlanImageUrl = searchParams.get('image');

  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [chakraOpacity, setChakraOpacity] = useState(1);
  const [showCenterMark, setShowCenterMark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(true); // Default to open on desktop
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (isMdUp) {
      setMobileOpen(true); // Always open on desktop
    } else {
      setMobileOpen(false); // Closed by default on mobile if not explicitly opened
    }
  }, [isMdUp]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Assuming Navbar height is 56px on mobile, 64px on desktop
  // Assuming Footer height is 56px (approx)
  const navbarHeight = { xs: 56, sm: 64 };
  const footerHeight = 56;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Main content area that fills space between Navbar and Footer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Make this component take available vertical space
          display: 'flex',
          flexDirection: 'row',
          height: 'calc(100vh - 56px - 56px)', // Re-add explicit height for proper layout
          [theme.breakpoints.up('sm')]: {
            height: 'calc(100vh - 64px - 56px)', // Re-add explicit height for proper layout
          },
          position: 'relative',
          backgroundColor: theme.palette.background.paper, // Set a clear background color for the main content area
        }}
      >
        {/* New Hamburger Menu Icon */}
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[3],
            borderRadius: '8px',
            padding: '8px',
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Backdrop for the floating menu */}
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1, // Above viewer, below controls
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
            transition: 'opacity 0.3s ease-in-out',
          }}
          open={mobileOpen}
          onClick={handleDrawerToggle} // Close on backdrop click
        />

        {/* Draggable Chakra Controls */}
        <DraggableChakraControls
          rotation={rotation}
          setRotation={setRotation}
          zoom={zoom}
          setZoom={setZoom}
          chakraOpacity={chakraOpacity}
          setChakraOpacity={setChakraOpacity}
          showCenterMark={showCenterMark}
          setShowCenterMark={setShowCenterMark}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        />

        {/* ChakraViewer area: takes remaining space */}
        <Box
          sx={{
            flexGrow: 1, // Takes remaining width of main content area
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto', // Allow scrolling for ChakraViewer content
            p: 2, // Padding around the viewer for aesthetics
            // Margin-left adjusted for new floating menu (no push content)
            marginLeft: 0,
            transition: 'none',
            // Adjust padding-top for the main content to clear the Navbar
            pt: { xs: `${navbarHeight.xs}px`, sm: `${navbarHeight.sm}px` },
            // Adjust padding-bottom for the main content to clear the Footer
            pb: `${footerHeight}px`,
            flex: 1, // Make this box take all available vertical space
            height: '100%', // Ensure it gets a height from its parent
          }}
        >
          <ChakraViewer
            rotation={rotation}
            zoom={zoom}
            chakraOpacity={chakraOpacity}
            showCenterMark={showCenterMark}
            floorPlanImageUrl={floorPlanImageUrl}
          />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
} 