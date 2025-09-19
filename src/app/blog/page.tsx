import type { Metadata } from "next";
import BlogPage from './BlogPage';

export const metadata: Metadata = {
  title: "Vastu Resources - Videos, Books, Tips & Posts | Brahma Vastu Blog",
  description: "Explore comprehensive Vastu resources including educational videos, books, expert tips, and community posts. Learn Vastu Shastra principles, remedies, and best practices for your home and office.",
  keywords: [
    "Vastu Resources",
    "Vastu Videos",
    "Vastu Books",
    "Vastu Tips",
    "Vastu Blog",
    "Vastu Education",
    "Vastu Learning",
    "Vastu Articles",
    "Vastu Community",
    "Vastu Knowledge",
    "Vastu Shastra Guide",
    "Home Vastu Tips",
    "Office Vastu",
    "Vastu Remedies"
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
    url: "http://localhost:3000/blog",
    siteName: "Brahma Vastu",
    title: "Vastu Resources - Videos, Books, Tips & Posts",
    description: "Explore comprehensive Vastu resources including educational videos, books, expert tips, and community posts. Learn Vastu Shastra principles and best practices.",
    images: [
      {
        url: "http://localhost:3000/images/bv.png",
        width: 1200,
        height: 630,
        alt: "Brahma Vastu - Vastu Resources and Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu Resources - Videos, Books, Tips & Posts",
    description: "Explore comprehensive Vastu resources including educational videos, books, expert tips, and community posts.",
    images: ["http://localhost:3000/images/bv.png"],
    creator: "@divyavastu",
  },
  alternates: {
    canonical: "http://localhost:3000/blog",
  },
  category: "Vastu Education",
  classification: "Vastu Learning Resources",
  other: {
    "application-name": "Brahma Vastu",
    "apple-mobile-web-app-title": "Vastu Resources",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#1976d2",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#1976d2",
  },
};

export default function Blog() {
  return <BlogPage />;
}
