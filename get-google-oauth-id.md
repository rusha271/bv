# Quick Google OAuth Setup

## Get Your Google OAuth Client ID in 5 Minutes

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create/Select Project
- Create a new project or select existing one
- Note your project ID

### 3. Enable APIs
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it
- Search for "Google OAuth2 API" and enable it

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External"
- Fill in:
  - App name: "Brahma Vastu"
  - User support email: your email
  - Developer contact: your email
- Save and continue

### 5. Create OAuth 2.0 Client ID
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Choose "Web application"
- Name: "Brahma Vastu Dev"
- Authorized JavaScript origins: `http://localhost:3000`
- Authorized redirect URIs: `http://localhost:3000`
- Click "Create"

### 6. Copy Your Client ID
- Copy the generated Client ID
- It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 7. Update Your .env.local File
Replace `your_google_client_id_for_development_here` with your actual client ID:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEV=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 8. Re-enable Google OAuth
Once you have your client ID, replace the disabled Google button in `src/components/ui/AuthComponent.tsx` with:

```tsx
<GoogleLogin
  onSuccess={handleGoogleOAuthSuccess}
  onError={() => {
    console.error('Google Login Failed');
    alert('Google login failed. Please try again.');
  }}
/>
```

### 9. Test
- Restart your development server
- Try the Google login button
- It should work without the "OAuth client was not found" error

## Need Help?
- Check the full guide in `OAUTH_SETUP_GUIDE.md`
- Make sure your domain is exactly `http://localhost:3000` in Google Cloud Console
- Ensure you're using the correct client ID for development vs production 