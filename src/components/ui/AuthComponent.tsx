"use client";

import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useDeviceType } from '../../utils/useDeviceType';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleSignin from 'react-apple-signin-auth';

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
  credential: string;
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

export const SocialAuth = ({ setFormData, setTabValue }: SocialAuthProps) => {
  const { isMobile } = useDeviceType();

  const env = process.env.NODE_ENV || 'development';
  const googleClientId =
    env === 'production'
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_PROD || ''
      : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEV || '';
  const facebookAppId =
    env === 'production'
      ? process.env.NEXT_PUBLIC_FACEBOOK_APP_ID_PROD || ''
      : process.env.NEXT_PUBLIC_FACEBOOK_APP_ID_DEV || '';
  const appleClientId =
    env === 'production'
      ? process.env.NEXT_PUBLIC_APPLE_CLIENT_ID_PROD || ''
      : process.env.NEXT_PUBLIC_APPLE_CLIENT_ID_DEV || '';
  const redirectUri =
    env === 'production'
      ? process.env.NEXT_PUBLIC_REDIRECT_URI_PROD || ''
      : process.env.NEXT_PUBLIC_REDIRECT_URI_DEV || '';

  const handleGoogleSuccess = async (response: GoogleResponse) => {
    if (response.credential) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.credential}` },
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
      } catch (error) {
        console.error('Google OAuth Error:', error);
        alert('Failed to authenticate with Google. Please try again.');
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      console.error('Google Login Failed');
      alert('Failed to authenticate with Google. Please try again.');
    },
    flow: 'implicit', // Ensure correct flow
  });

  const handleFacebookResponse = (response: FacebookResponse) => {
    setFormData((prev) => ({
      ...prev,
      email: response.email || '',
      fullName: response.name || '',
      password: '',
      confirmPassword: '',
      phone: '',
    }));
    setTabValue(1);
  };

  const handleAppleSuccess = (response: AppleResponse) => {
    setFormData((prev) => ({
      ...prev,
      email: response?.user?.email || '',
      fullName: response?.user?.name || '',
      password: '',
      confirmPassword: '',
      phone: '',
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
        <button
          type="button"
          onClick={() => login()}
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
          <img src="/icons/google.svg" alt="Google" style={{ width: 20, height: 20 }} />
          {isMobile ? 'Continue with Google' : 'Google'}
        </button>
        <FacebookLogin
          appId={facebookAppId}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={(renderProps) => (
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
        <AppleSignin
          authOptions={{
            clientId: appleClientId,
            scope: 'name email',
            redirectURI: redirectUri,
            usePopup: true,
          }}
          uiType="dark"
          onSuccess={handleAppleSuccess}
          onError={() => {
            console.error('Apple Login Failed');
            alert('Apple login failed. Please try again.');
          }}
          render={(renderProps) => (
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