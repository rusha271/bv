import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiService } from '@/utils/apiService';
import { generateBlogMetaTags, generateBlogStructuredData } from '@/utils/seoUtils';
import BlogPostPage from './BlogPostPage';

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

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const blogId = params.id;
    
    // Note: You'll need to implement getById for blog posts in your API service
    // For now, we'll use a placeholder
    const blog = await apiService.blog?.getById?.(blogId);
    
    if (!blog) {
      return {
        title: 'Blog Post Not Found | Brahma Vastu',
        description: 'The requested blog post could not be found.',
      };
    }

    const metaTags = generateBlogMetaTags(blog as any);
    
    return {
      title: metaTags.title,
      description: metaTags.description,
      keywords: metaTags.keywords,
      openGraph: {
        title: metaTags.openGraph.title,
        description: metaTags.openGraph.description,
        type: metaTags.openGraph.type as any,
        url: metaTags.openGraph.url,
        images: [
          {
            url: metaTags.openGraph.image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        siteName: metaTags.openGraph.siteName,
        publishedTime: metaTags.openGraph.article?.publishedTime,
        modifiedTime: metaTags.openGraph.article?.modifiedTime,
        authors: metaTags.openGraph.article?.authors,
        section: metaTags.openGraph.article?.section,
        tags: metaTags.openGraph.article?.tags,
      },
      twitter: {
        card: metaTags.twitter.card as any,
        title: metaTags.twitter.title,
        description: metaTags.twitter.description,
        images: [metaTags.twitter.image],
        creator: metaTags.twitter.creator,
      },
      other: {
        'article:author': metaTags.additionalMetaTags.find(tag => tag.name === 'article:author')?.content || '',
        'article:published_time': metaTags.additionalMetaTags.find(tag => tag.name === 'article:published_time')?.content || '',
        'article:modified_time': metaTags.additionalMetaTags.find(tag => tag.name === 'article:modified_time')?.content || '',
        'article:section': metaTags.additionalMetaTags.find(tag => tag.name === 'article:section')?.content || '',
        'article:tag': metaTags.additionalMetaTags.find(tag => tag.name === 'article:tag')?.content || '',
      },
    };
  } catch (error) {
    // console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Blog Post | Brahma Vastu',
      description: 'Read Vastu blog posts and articles.',
    };
  }
}

export default async function BlogPostPageRoute({ params }: BlogPostPageProps) {
  try {
    const blogId = params.id;

    // Note: You'll need to implement getById for blog posts in your API service
    const blog = await apiService.blog?.getById?.(blogId);
    
    if (!blog) {
      notFound();
    }

    const structuredData = generateBlogStructuredData(blog as any);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <BlogPostPage blog={blog as any} />
      </>
    );
  } catch (error) {
    // console.error('Error loading blog post:', error);
    notFound();
  }
}

// Generate static params for popular blog posts (optional)
export async function generateStaticParams() {
  try {
    // Note: You'll need to implement getAll for blog posts in your API service
    const blogs = await apiService.blog?.getAll?.() || [];
    return blogs.slice(0, 10).map((blog) => ({
      id: blog.id,
    }));
  } catch (error) {
    // console.error('Error generating static params:', error);
    return [];
  }
}
