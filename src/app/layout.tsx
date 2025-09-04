import type { Metadata } from "next";
import "./globals.css";
import "../styles/jcrop.css";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PlanetaryDataProvider } from '@/contexts/PlanetaryDataContext';
import { LegalProvider } from '@/contexts/LegalContent';
import Chatbot from '@/components/Chatbot';
import ClientOnly from '@/components/ClientOnly';
import ReduxProvider from '@/components/providers/ReduxProvider';
import Toast from "@/components/ui/Toast";
import GuestAccountManager from '@/components/GuestAccountManager';
import GuestBanner from '@/components/GuestBanner';

export const metadata: Metadata = {
  title: {
    default: "Divya Vastu - Professional Vastu Consultation & Floor Plan Analysis",
    template: "%s | Divya Vastu"
  },
  description: "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance for your home and office.",
  keywords: [
    "Vastu Shastra",
    "Vastu Consultation",
    "Floor Plan Analysis",
    "Home Vastu",
    "Office Vastu",
    "Vastu Expert",
    "Vastu Tips",
    "Vastu Remedies",
    "Divya Vastu",
    "Brahma Vastu",
    "Vastu Analysis",
    "Vastu Check",
    "Vastu Services"
  ],
  authors: [{ name: "Divya Vastu Team" }],
  creator: "Divya Vastu",
  publisher: "Brahma Vastu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Divya Vastu",
    title: "Divya Vastu - Professional Vastu Consultation & Floor Plan Analysis",
    description: "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance.",
    images: [
      {
        url: "/images/bv.png",
        width: 1200,
        height: 630,
        alt: "Divya Vastu - Professional Vastu Consultation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divya Vastu - Professional Vastu Consultation & Floor Plan Analysis",
    description: "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, and remedies.",
    images: ["/images/bv.png"],
    creator: "@divyavastu",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "Vastu Shastra",
  classification: "Vastu Consultation Services",
  other: {
    "application-name": "Divya Vastu",
    "apple-mobile-web-app-title": "Divya Vastu",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#1976d2",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#1976d2",
    "color-scheme": "light dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Divya Vastu",
              "alternateName": "Brahma Vastu",
              "url": "https://yourdomain.com",
              "logo": "https://yourdomain.com/images/bv.png",
              "description": "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance for your home and office.",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Divya Vastu Team"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://twitter.com/divyavastu",
                "https://facebook.com/divyavastu",
                "https://instagram.com/divyavastu"
              ],
              "service": {
                "@type": "Service",
                "name": "Vastu Consultation",
                "description": "Professional Vastu Shastra consultation and floor plan analysis services",
                "provider": {
                  "@type": "Organization",
                  "name": "Divya Vastu"
                },
                "areaServed": "Worldwide",
                "serviceType": "Vastu Shastra Consultation"
              }
            })
          }}
        />
      </head>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <CssBaseline />
            <AuthProvider>
              <GuestAccountManager>
                <PlanetaryDataProvider>
                  <LegalProvider>
                    <GuestBanner />
                    {children}
                    <ClientOnly>
                      <Chatbot />
                    </ClientOnly>
                  </LegalProvider>
                </PlanetaryDataProvider>
              </GuestAccountManager>
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
        <Toast />
      </body>
    </html>
  );
}