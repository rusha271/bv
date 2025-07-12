# OAuth Setup Guide

## Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Brahma Vastu"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

### Step 3: Create OAuth 2.0 Client IDs
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. For Development:
   - Name: "Brahma Vastu Dev"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
5. For Production:
   - Name: "Brahma Vastu Prod"
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com`

### Step 4: Update Environment Variables
Replace the placeholder values in your `.env.local` file:

```env
# Google OAuth Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEV=your_development_client_id_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID_PROD=your_production_client_id_here

# Apple Sign In (Optional)
NEXT_PUBLIC_APPLE_CLIENT_ID_DEV=your_apple_client_id_for_development_here
NEXT_PUBLIC_APPLE_CLIENT_ID_PROD=your_apple_client_id_for_production_here

# Redirect URIs
NEXT_PUBLIC_REDIRECT_URI_DEV=http://localhost:3000
NEXT_PUBLIC_REDIRECT_URI_PROD=https://your-production-domain.com
```

### Step 5: Re-enable Google OAuth
Once you have your Google Client ID, update the `AuthComponent.tsx` file to re-enable Google OAuth:

```tsx
{/* Google */}
<GoogleLogin
  onSuccess={handleGoogleOAuthSuccess}
  onError={() => {
    console.error('Google Login Failed: Check Client ID and OAuth configuration');
    alert('Google login failed. Please check your Client ID and OAuth settings.');
  }}
  // useOneTap // Temporarily disabled to avoid FedCM issues
/>
```

## Apple Sign In Setup (Optional)

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create an App ID
3. Enable Sign In with Apple
4. Create a Services ID
5. Configure domains and redirect URLs

## Testing

1. Start your development server: `npm run dev`
2. Open the login dialog
3. Try the Google OAuth button
4. Check browser console for any errors

## Common Issues

1. **"OAuth client was not found"**: Check if your client ID is correct and the domain is authorized
2. **"Invalid redirect URI"**: Make sure your redirect URI matches exactly what's configured in Google Cloud Console
3. **"Access blocked"**: Check if your app is in testing mode and you're using an authorized test user

## Security Notes

- Never commit your `.env.local` file to version control
- Use different client IDs for development and production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console 