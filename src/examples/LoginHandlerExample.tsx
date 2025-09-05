/**
 * Example Login Handler showing how to use the updated AuthContext
 * This demonstrates the proper integration with JWT decoding and role management
 */

'use client';

import React, { useState } from 'react';
import { useAuthActions, useAuthUser } from '@/contexts/AuthContext';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { toast } from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginHandlerExample() {
  const { login } = useAuthActions();
  const user = useAuthUser();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the AuthContext login function
      // This will:
      // 1. Make API call to login endpoint
      // 2. Store JWT in localStorage/sessionStorage
      // 3. Decode JWT to extract user role
      // 4. Update AuthContext state with user data including role
      // 5. Trigger navbar re-render with updated user state
      await login(formData.email, formData.password, true); // rememberMe = true
      
      toast.success('Login successful!');
      
      // The navbar will automatically update to show admin button if user.role.name === 'admin'
      // No manual state management needed - the AuthContext handles everything
      
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Login Handler Example
      </Typography>
      
      {user && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Logged in as: {user.name} (Role: {user.role?.name})
        </Alert>
      )}
      
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          margin="normal"
          required
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        After successful login, the navbar will automatically update to show the 
        "Admin Dashboard" button if the user has admin role.
      </Typography>
    </Box>
  );
}

/**
 * Key Points:
 * 
 * 1. The AuthContext now properly decodes JWT tokens to extract user roles
 * 2. After login, the context state updates immediately with the correct role
 * 3. The Navbar component automatically re-renders when the user state changes
 * 4. No manual state management or page reloads needed
 * 5. The admin button appears instantly for admin users
 * 
 * The JWT decoding happens in the AuthContext login function:
 * - decodeJWT(response.access_token) extracts the role from the token
 * - userRole = decodedToken?.role || response.user.role || 'user'
 * - This ensures the role is always available from the JWT
 */
