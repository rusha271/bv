/**
 * SEO Utilities
 * 
 * Provides utilities for dynamic meta tags, structured data, and SEO optimization.
 */

export interface VideoSEOData {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  views: number;
  category?: string;
  upload_date?: string;
  created_at?: string;
}

export interface BlogSEOData {
  id: string | number;
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

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  twitterHandle: string;
  facebookAppId?: string;
}

const defaultSEOConfig: SEOConfig = {
  siteName: 'Brahma Vastu',
  siteUrl: 'http://localhost:3000',
  defaultImage: '/images/bv.png',
  twitterHandle: '@divyavastu'
};

/**
 * Generate video structured data
 */
export function generateVideoStructuredData(video: VideoSEOData, config: SEOConfig = defaultSEOConfig) {
  const videoUrl = video.url?.startsWith('/') 
    ? `${config.siteUrl}${video.url}`
    : video.url;

  const thumbnailUrl = video.thumbnail?.startsWith('/')
    ? `${config.siteUrl}${video.thumbnail}`
    : video.thumbnail;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": thumbnailUrl || config.defaultImage,
    "uploadDate": video.upload_date || video.created_at,
    "duration": video.duration,
    "contentUrl": videoUrl,
    "embedUrl": videoUrl,
    "publisher": {
      "@type": "Organization",
      "name": config.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${config.siteUrl}${config.defaultImage}`
      }
    },
    "genre": video.category || "Vastu Shastra",
    "keywords": ["Vastu", "Vastu Shastra", "Vastu Tips", "Vastu Videos", video.category].filter(Boolean)
  };
}

/**
 * Generate blog post structured data
 */
export function generateBlogStructuredData(blog: BlogSEOData, config: SEOConfig = defaultSEOConfig) {
  const featuredImageUrl = blog.featured_image?.startsWith('/')
    ? `${config.siteUrl}${blog.featured_image}`
    : blog.featured_image;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.content.substring(0, 160),
    "image": featuredImageUrl || `${config.siteUrl}${config.defaultImage}`,
    "author": {
      "@type": "Person",
      "name": blog.author || "Brahma Vastu Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": config.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${config.siteUrl}${config.defaultImage}`
      }
    },
    "datePublished": blog.published_date || blog.updated_date,
    "dateModified": blog.updated_date || blog.published_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${config.siteUrl}/blog/${blog.id}`
    },
    "articleSection": blog.category || "Vastu Shastra",
    "keywords": blog.tags || ["Vastu", "Vastu Shastra", "Vastu Tips", blog.category].filter(Boolean)
  };
}

/**
 * Generate video meta tags
 */
export function generateVideoMetaTags(video: VideoSEOData, config: SEOConfig = defaultSEOConfig) {
  const videoUrl = video.url?.startsWith('/') 
    ? `${config.siteUrl}${video.url}`
    : video.url;

  const thumbnailUrl = video.thumbnail?.startsWith('/')
    ? `${config.siteUrl}${video.thumbnail}`
    : video.thumbnail;

  return {
    title: `${video.title} | ${config.siteName}`,
    description: video.description,
    keywords: `Vastu, Vastu Shastra, Vastu Videos, ${video.category || ''}`.trim(),
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
      url: `${config.siteUrl}/video/${video.id}`,
      image: thumbnailUrl || `${config.siteUrl}${config.defaultImage}`,
      video: {
        url: videoUrl,
        type: 'video/mp4',
        width: 1920,
        height: 1080
      },
      siteName: config.siteName
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: video.description,
      image: thumbnailUrl || `${config.siteUrl}${config.defaultImage}`,
      player: {
        url: videoUrl,
        width: 1920,
        height: 1080
      },
      creator: config.twitterHandle
    },
    additionalMetaTags: [
      {
        name: 'video:duration',
        content: video.duration || ''
      },
      {
        name: 'video:category',
        content: video.category || 'Vastu Shastra'
      }
    ]
  };
}

/**
 * Generate blog meta tags
 */
export function generateBlogMetaTags(blog: BlogSEOData, config: SEOConfig = defaultSEOConfig) {
  const featuredImageUrl = blog.featured_image?.startsWith('/')
    ? `${config.siteUrl}${blog.featured_image}`
    : blog.featured_image;

  return {
    title: `${blog.title} | ${config.siteName}`,
    description: blog.excerpt || blog.content.substring(0, 160),
    keywords: `Vastu, Vastu Shastra, Vastu Tips, ${blog.category || ''}, ${(blog.tags || []).join(', ')}`.trim(),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      type: 'article',
      url: `${config.siteUrl}/blog/${blog.id}`,
      image: featuredImageUrl || `${config.siteUrl}${config.defaultImage}`,
      article: {
        publishedTime: blog.published_date,
        modifiedTime: blog.updated_date,
        authors: [blog.author || 'Brahma Vastu Team'],
        section: blog.category || 'Vastu Shastra',
        tags: blog.tags || ['Vastu', 'Vastu Shastra']
      },
      siteName: config.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      image: featuredImageUrl || `${config.siteUrl}${config.defaultImage}`,
      creator: config.twitterHandle
    },
    additionalMetaTags: [
      {
        name: 'article:author',
        content: blog.author || 'Brahma Vastu Team'
      },
      {
        name: 'article:published_time',
        content: blog.published_date || ''
      },
      {
        name: 'article:modified_time',
        content: blog.updated_date || ''
      },
      {
        name: 'article:section',
        content: blog.category || 'Vastu Shastra'
      },
      {
        name: 'article:tag',
        content: (blog.tags || []).join(', ')
      }
    ]
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>, config: SEOConfig = defaultSEOConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${config.siteUrl}${item.url}`
    }))
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData(config: SEOConfig = defaultSEOConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.siteName,
    "alternateName": "Brahma Vastu",
    "url": config.siteUrl,
    "logo": `${config.siteUrl}${config.defaultImage}`,
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
      `https://twitter.com/${config.twitterHandle.replace('@', '')}`,
      "https://facebook.com/divyavastu",
      "https://instagram.com/divyavastu"
    ],
    "service": {
      "@type": "Service",
      "name": "Vastu Consultation",
      "description": "Professional Vastu Shastra consultation and floor plan analysis services",
      "provider": {
        "@type": "Organization",
        "name": config.siteName
      },
      "areaServed": "Worldwide",
      "serviceType": "Vastu Shastra Consultation"
    }
  };
}

/**
 * Generate sitemap data
 */
export function generateSitemapData(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>, config: SEOConfig = defaultSEOConfig) {
  return {
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: pages.map(page => ({
        loc: page.url.startsWith('http') ? page.url : `${config.siteUrl}${page.url}`,
        lastmod: page.lastmod || new Date().toISOString().split('T')[0],
        changefreq: page.changefreq || 'weekly',
        priority: page.priority || 0.8
      }))
    }
  };
}

/**
 * Utility to update document head with meta tags
 */
export function updateDocumentHead(metaTags: any) {
  if (typeof document === 'undefined') return;

  // Update title
  if (metaTags.title) {
    document.title = metaTags.title;
  }

  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && metaTags.description) {
    descriptionMeta.setAttribute('content', metaTags.description);
  }

  // Update Open Graph tags
  if (metaTags.openGraph) {
    Object.entries(metaTags.openGraph).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue) {
            const property = `og:${key}:${subKey}`;
            updateMetaTag(property, subValue as string);
          }
        });
      } else if (value) {
        const property = `og:${key}`;
        updateMetaTag(property, value as string);
      }
    });
  }

  // Update Twitter tags
  if (metaTags.twitter) {
    Object.entries(metaTags.twitter).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue) {
            const name = `twitter:${key}:${subKey}`;
            updateMetaTag(name, subValue as string, 'name');
          }
        });
      } else if (value) {
        const name = `twitter:${key}`;
        updateMetaTag(name, value as string, 'name');
      }
    });
  }

  // Update additional meta tags
  if (metaTags.additionalMetaTags) {
    metaTags.additionalMetaTags.forEach((tag: any) => {
      updateMetaTag(tag.name, tag.content, 'name');
    });
  }
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(property: string, content: string, attribute: string = 'property') {
  let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, property);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}

export default {
  generateVideoStructuredData,
  generateBlogStructuredData,
  generateVideoMetaTags,
  generateBlogMetaTags,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateOrganizationStructuredData,
  generateSitemapData,
  updateDocumentHead
};
