'use client';

import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { loaderUtils } from '@/utils/loaderUtils';

/**
 * Test component to demonstrate loader functionality
 * This component can be temporarily added to any page for testing
 */
const LoaderTestComponent: React.FC = () => {
  const handleShowLoader = () => {
    loaderUtils.show();
  };

  const handleHideLoader = () => {
    loaderUtils.hide();
  };

  const handleSimulateLoading = () => {
    loaderUtils.simulateLoading(3000);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Loader Test
      </Typography>
      <Stack spacing={1}>
        <Button
          variant="contained"
          size="small"
          onClick={handleShowLoader}
          fullWidth
        >
          Show Loader
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleHideLoader}
          fullWidth
        >
          Hide Loader
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleSimulateLoading}
          fullWidth
        >
          Simulate Loading (3s)
        </Button>
      </Stack>
    </Box>
  );
};

export default LoaderTestComponent;
