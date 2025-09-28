import type { Metadata } from "next";
import "./globals.css";
import "../styles/jcrop.css";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import { PlanetaryDataProvider } from '@/contexts/PlanetaryDataContext';
import { LegalProvider } from '@/contexts/LegalContent';
import { ModalProvider } from '@/contexts/ModalContext';
import GlobalModalWrapper from '@/components/Modals/GlobalModalWrapper';
import Chatbot from '@/components/Bot/Chatbot';
import ClientOnly from '@/components/Auth/ClientOnly';
import ReduxProvider from '@/components/providers/ReduxProvider';
import Toast from "@/components/Toast/Toast";
import GuestAccountManager from '@/components/Guest Components/GuestAccountManager';
import GuestBanner from '@/components/Guest Components/GuestBanner';
import SmartPageLoader from '@/components/Loader/SmartPageLoader';
import ConditionalChatbot from '@/components/Bot/ConditionalChatbot';

export const metadata: Metadata = {
  title: {
    default: "Brahma Vastu - Professional Vastu Consultation & Floor Plan Analysis",
    template: "%s | Brahma Vastu"
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
    "Brahma Vastu",
    "Brahma Vastu",
    "Vastu Analysis",
    "Vastu Check",
    "Vastu Services"
  ],
  authors: [{ name: "Brahma Vastu Team" }],
  creator: "Brahma Vastu",
  publisher: "Brahma Vastu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
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
    url: "http://localhost:3000",
    siteName: "Brahma Vastu",
    title: "Brahma Vastu - Professional Vastu Consultation & Floor Plan Analysis",
    description: "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance.",
    images: [
      {
        url: "/images/bv.png",
        width: 1200,
        height: 630,
        alt: "Brahma Vastu - Professional Vastu Consultation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahma Vastu - Professional Vastu Consultation & Floor Plan Analysis",
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
    "application-name": "Brahma Vastu",
    "apple-mobile-web-app-title": "Brahma Vastu",
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
        <link rel="icon" href="/universe-big-cosmos-gravity-svgrepo-com.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <link rel="canonical" href="http://localhost:3000" />
        <link rel="alternate" hrefLang="en" href="http://localhost:3000" />
        <link rel="alternate" hrefLang="x-default" href="http://localhost:3000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Brahma Vastu",
              "alternateName": "Brahma Vastu",
              "url": "http://localhost:3000",
              "logo": "http://localhost:3000/images/bv.png",
              "description": "Professional Vastu Shastra consultation services. Get instant Vastu analysis of your floor plan, expert tips, remedies, and comprehensive guidance for your home and office.",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Brahma Vastu Team"
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
                  "name": "Brahma Vastu"
                },
                "areaServed": "Worldwide",
                "serviceType": "Vastu Shastra Consultation",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                  "description": "Free Vastu consultation and floor plan analysis"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "India"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Brahma Vastu",
              "alternateName": "Brahma Vastu",
              "url": "http://localhost:3000",
              "description": "Get instant Vastu analysis of your floor plan. Upload your floor plan image and receive comprehensive Vastu recommendations for your home or office.",
              "publisher": {
                "@type": "Organization",
                "name": "Brahma Vastu",
                "logo": {
                  "@type": "ImageObject",
                  "url": "http://localhost:3000/images/bv.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "http://localhost:3000/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "Service",
                "name": "Vastu Floor Plan Analysis",
                "description": "Professional Vastu Shastra consultation and floor plan analysis services",
                "provider": {
                  "@type": "Organization",
                  "name": "Brahma Vastu"
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
            <LoadingProvider>
              <AuthProvider>
                <GuestAccountManager>
                  <PlanetaryDataProvider>
                    <LegalProvider>
                      <ModalProvider>
                        <ClientOnly>
                          <SmartPageLoader />
                          <GuestBanner />
                          {/* <ConditionalChatbot /> */}
                        </ClientOnly>
                        {children}
                        <GlobalModalWrapper />
                      </ModalProvider>
                    </LegalProvider>
                  </PlanetaryDataProvider>
                </GuestAccountManager>
              </AuthProvider>
            </LoadingProvider>
          </ThemeProvider>
        </ReduxProvider>
        <ClientOnly>
          <Toast />
        </ClientOnly>
      </body>
    </html>
  );
}