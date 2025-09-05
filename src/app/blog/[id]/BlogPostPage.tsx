"use client";

import React, { useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
// Note: You'll need to define the Blog interface in your API service
interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  published_date?: string;
  updated_date?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
}
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { generateBreadcrumbStructuredData } from '@/utils/seoUtils';

interface BlogPostPageProps {
  blog: Blog;
}

export default function BlogPostPage({ blog }: BlogPostPageProps) {
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.id}` }
  ]);

  useEffect(() => {
    // Add breadcrumb structured data to document head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [breadcrumbData]);

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: theme.palette.background.default }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900" />
      
      <Navbar />
      
      {/* Main content container */}
      <main
        className="flex-1 w-full max-w-4xl mx-auto rounded-xl shadow-md px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 box-border"
        style={{
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          minHeight: '80vh',
          marginTop: isMobile ? '4.5rem' : '5.5rem',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
        }}
      >
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <a
                href="/blog"
                className="hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Blog
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500 truncate">{blog.title}</li>
          </ol>
        </nav>

        {/* Blog Post Content */}
        <article className="prose prose-lg max-w-none">
          {/* Header */}
          <header className="mb-8">
            <h1
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: theme.palette.text.primary }}
            >
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {blog.author && (
                <span style={{ color: theme.palette.text.secondary }}>
                  By {blog.author}
                </span>
              )}
              {blog.published_date && (
                <span style={{ color: theme.palette.text.secondary }}>
                  {new Date(blog.published_date).toLocaleDateString()}
                </span>
              )}
              {blog.category && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {blog.category}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {blog.featured_image && (
              <div className="mb-8">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Excerpt */}
            {blog.excerpt && (
              <div
                className="text-lg leading-relaxed mb-6 p-4 rounded-lg"
                style={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.secondary,
                }}
              >
                {blog.excerpt}
              </div>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            style={{
              color: theme.palette.text.primary,
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                lineHeight: '1.8',
                fontSize: '1.1rem',
              }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.palette.divider }}>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: theme.palette.text.primary }}
              >
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          {blog.author && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.palette.divider }}>
              <div className="flex items-start space-x-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: theme.palette.text.primary }}
                  >
                    {blog.author}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    Vastu Expert & Content Creator
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: theme.palette.divider }}>
            <h3
              className="text-xl font-semibold mb-6"
              style={{ color: theme.palette.text.primary }}
            >
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* You can add related posts here */}
              <div
                className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: theme.palette.background.default,
                  borderColor: theme.palette.divider,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: theme.palette.text.primary }}
                >
                  More Vastu Tips
                </h4>
                <p
                  className="text-sm"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Discover more Vastu principles and remedies for your home.
                </p>
              </div>
              <div
                className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: theme.palette.background.default,
                  borderColor: theme.palette.divider,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: theme.palette.text.primary }}
                >
                  Vastu Consultation
                </h4>
                <p
                  className="text-sm"
                  style={{ color: theme.palette.text.secondary }}
                >
                  Get personalized Vastu consultation for your property.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
