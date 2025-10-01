import { MetadataRoute } from 'next';
import { apiService } from '@/utils/apiService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/crop`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chakra-overlay`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Dynamic video pages
    const videos = await apiService.videos.getAll();
    const videoPages: MetadataRoute.Sitemap = videos
      .filter(video => video && video.id) // Filter out invalid videos
      .map((video) => ({
        url: `${baseUrl}/video/${video.id}`,
        lastModified: new Date(video.updated_at || video.created_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    // Dynamic blog pages (if blog API is available)
    let blogPages: MetadataRoute.Sitemap = [];
    try {
      const blogs = await apiService.blog?.getAll?.() || [];
      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.id}`,
        lastModified: new Date(blog.published_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    } catch (error) {
      // console.warn('Blog API not available for sitemap generation:', error);
    }

    return [...staticPages, ...videoPages, ...blogPages];
  } catch (error) {
    // console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
