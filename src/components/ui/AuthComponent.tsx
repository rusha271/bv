import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useDeviceType } from '../../utils/useDeviceType';
import { GoogleLogin, googleLogout, useGoogleLogin, TokenResponse } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleSignin from 'react-apple-signin-auth';

// TypeScript Interfaces
interface SocialAuthProps {
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      confirmPassword: string;
      fullName: string;
      phone: string;
    }>
  >;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
}

interface GoogleResponse {
  credential?: string;
  // Add other properties as needed based on your JWT decoding
}

interface FacebookResponse {
  email?: string;
  name?: string;
}

interface AppleResponse {
  user?: {
    email?: string;
    name?: string;
  };
}

// Mock function to simulate fetching user data from social providers
const fetchSocialUserData = async (provider: 'google' | 'facebook' | 'apple'): Promise<Partial<{
  email: string;
  fullName: string;
  phone: string;
}>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock user data based on provider
  switch (provider) {
    case 'google':
      return {
        email: 'user@example.com',
        fullName: 'John Doe',
        phone: '+1234567890',
      };
    case 'facebook':
      return {
        email: 'user@facebook.com',
        fullName: 'Jane Smith',
        phone: '',
      };
    case 'apple':
      return {
        email: 'user@icloud.com',
        fullName: 'Alex Johnson',
        phone: '',
      };
    default:
      return {};
  }
};

export const SocialAuth = ({ setFormData, setTabValue }: SocialAuthProps) => {
  const { isMobile } = useDeviceType();

  // Google Success Handler
  const handleGoogleOAuthSuccess = async (credentialResponse: GoogleResponse) => {
    if (credentialResponse.credential) {
      // Decode the JWT or send it to your backend to fetch user info
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${credentialResponse.credential}`,
        },
      });
      const profile = await res.json();
      setFormData((prev) => ({
        ...prev,
        email: profile.email || '',
        fullName: profile.name || '',
        password: '',
        confirmPassword: '',
        phone: '',
      }));
      setTabValue(1);
    }
  };

  // Facebook Success Handler
  const handleFacebookResponse = async (response: FacebookResponse) => {
    const userData = await fetchSocialUserData('facebook');
    setFormData((prev) => ({
      ...prev,
      email: userData.email || response.email || '',
      fullName: userData.fullName || response.name || '',
      password: '',
      confirmPassword: '',
      phone: userData.phone || '',
    }));
    setTabValue(1);
  };

  // Apple Success Handler
  const handleAppleSuccess = async (response: AppleResponse) => {
    const userData = await fetchSocialUserData('apple');
    setFormData((prev) => ({
      ...prev,
      email: userData.email || response?.user?.email || '',
      fullName: userData.fullName || response?.user?.name || '',
      password: '',
      confirmPassword: '',
      phone: userData.phone || '',
    }));
    setTabValue(1);
  };

  return (
    <Box sx={{ mt: isMobile ? 3 : 4 }}>
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center">
        {/* Google */}
        <GoogleLogin
            onSuccess={handleGoogleOAuthSuccess}
            onError={() => alert('Google login failed')}
            useOneTap
        />

        {/* Facebook */}
        <FacebookLogin
          appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              style={{
                width: isMobile ? '100%' : undefined,
                border: '1px solid #e0e0e0',
                borderRadius: 16,
                padding: '10px 0',
                background: '#fff',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              <img src="/icons/facebook.svg" alt="Facebook" style={{ width: 20, height: 20 }} />
              {isMobile ? 'Continue with Facebook' : 'Facebook'}
            </button>
          )}
        />

        {/* Apple */}
        <AppleSignin
          authOptions={{
            clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
            scope: 'name email',
            redirectURI: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
            usePopup: true,
          }}
          uiType="dark"
          onSuccess={handleAppleSuccess}
          onError={() => alert('Apple login failed')}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              style={{
                width: isMobile ? '100%' : undefined,
                border: '1px solid #e0e0e0',
                borderRadius: 16,
                padding: '10px 0',
                background: '#fff',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              <img src="/icons/apple.svg" alt="Apple" style={{ width: 20, height: 20 }} />
              {isMobile ? 'Continue with Apple' : 'Apple'}
            </button>
          )}
        />
      </Stack>
    </Box>
  );
};