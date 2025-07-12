# Brahma Vastu - Vastu Shastra Application

A modern web application for Vastu Shastra consultations and resources, built with Next.js, React, and Material-UI.

## 🚀 Features

- **Vastu Consultation**: AI-powered chatbot for Vastu advice
- **Resource Library**: Videos, books, and tips about Vastu Shastra
- **Modern UI**: Responsive design with Material-UI components
- **Authentication**: Google and Apple OAuth integration
- **Error Handling**: Professional error display components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Authentication**: Google OAuth, Apple Sign In
- **Styling**: Tailwind CSS + MUI
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bv
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OAuth credentials to `.env.local`:
```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID_DEV=your_development_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID_PROD=your_production_client_id

# Apple Sign In
NEXT_PUBLIC_APPLE_CLIENT_ID_DEV=your_apple_client_id_dev
NEXT_PUBLIC_APPLE_CLIENT_ID_PROD=your_apple_client_id_prod

# Redirect URIs
NEXT_PUBLIC_REDIRECT_URI_DEV=http://localhost:3000
NEXT_PUBLIC_REDIRECT_URI_PROD=https://your-domain.vercel.app
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Environment Variables

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID_PROD`
- `NEXT_PUBLIC_APPLE_CLIENT_ID_PROD`
- `NEXT_PUBLIC_REDIRECT_URI_PROD`

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── blog/           # Blog pages
│   └── ...
├── components/         # React components
│   ├── ui/            # UI components
│   └── ...
├── contexts/          # React contexts
├── store/             # Redux store
├── utils/             # Utility functions
└── types/             # TypeScript types
```

## 🔧 Configuration

### Next.js Config
- Optimized for Vercel deployment
- WebAssembly support for AI models
- Bundle optimization for better performance

### Vercel Config
- Function timeout: 30 seconds
- Security headers configured
- Optimized build settings

## 🐛 Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check TypeScript errors locally first
- Verify all dependencies are installed

### Runtime Errors
- Check browser console for client-side errors
- Monitor Vercel function logs for API errors
- Verify OAuth credentials are correct

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, please open an issue in the GitHub repository. 