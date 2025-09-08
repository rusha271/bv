import type { Metadata } from "next";
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: "Brahma Vastu - Check Vastu from Your Floor Plan | Brahma Vastu",
  description: "Get instant Vastu analysis of your floor plan. Upload your floor plan image and receive comprehensive Vastu recommendations for your home or office. Professional Vastu consultation made easy.",
  keywords: [
    "Vastu Shastra",
    "Floor Plan Analysis",
    "Vastu Consultation",
    "Home Vastu",
    "Office Vastu",
    "Vastu Tips",
    "Vastu Remedies",
    "Brahma Vastu",
    "Brahma Vastu",
    "Vastu Expert",
    "Vastu Analysis",
    "Vastu Check"
  ],
  authors: [{ name: "Brahma Vastu Team" }],
  creator: "Brahma Vastu",
  publisher: "Brahma Vastu",
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
    title: "Brahma Vastu - Check Vastu from Your Floor Plan",
    description: "Get instant Vastu analysis of your floor plan. Upload your floor plan image and receive comprehensive Vastu recommendations for your home or office.",
    images: [
      {
        url: "http://localhost:3000/images/bv.png",
        width: 1200,
        height: 630,
        alt: "Brahma Vastu - Floor Plan Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahma Vastu - Check Vastu from Your Floor Plan",
    description: "Get instant Vastu analysis of your floor plan. Upload your floor plan image and receive comprehensive Vastu recommendations.",
    images: ["http://localhost:3000/images/bv.png"],
    creator: "@divyavastu",
  },
  alternates: {
    canonical: "http://localhost:3000",
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
  },
};

export default function Home() {
  return <HomePage />;
}