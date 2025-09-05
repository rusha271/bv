import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiService } from '@/utils/apiService';
import { generateVideoMetaTags, generateVideoStructuredData } from '@/utils/seoUtils';
import VideoPage from './VideoPage';

interface VideoPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  try {
    const videoId = parseInt(params.id);
    if (isNaN(videoId)) {
      return {
        title: 'Video Not Found | Divya Vastu',
        description: 'The requested video could not be found.',
      };
    }

    const video = await apiService.videos.getById(videoId);
    
    if (!video) {
      return {
        title: 'Video Not Found | Divya Vastu',
        description: 'The requested video could not be found.',
      };
    }

    const metaTags = generateVideoMetaTags(video);
    
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
            width: 1920,
            height: 1080,
            alt: video.title,
          },
        ],
        siteName: metaTags.openGraph.siteName,
      },
      twitter: {
        card: metaTags.twitter.card as any,
        title: metaTags.twitter.title,
        description: metaTags.twitter.description,
        images: [metaTags.twitter.image],
        creator: metaTags.twitter.creator,
      },
      other: {
        'video:duration': metaTags.additionalMetaTags.find(tag => tag.name === 'video:duration')?.content || '',
        'video:views': metaTags.additionalMetaTags.find(tag => tag.name === 'video:views')?.content || '',
        'video:category': metaTags.additionalMetaTags.find(tag => tag.name === 'video:category')?.content || '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for video:', error);
    return {
      title: 'Video | Divya Vastu',
      description: 'Watch Vastu videos and tutorials.',
    };
  }
}

export default async function VideoPageRoute({ params }: VideoPageProps) {
  try {
    const videoId = parseInt(params.id);
    if (isNaN(videoId)) {
      notFound();
    }

    const video = await apiService.videos.getById(videoId);
    
    if (!video) {
      notFound();
    }

    const structuredData = generateVideoStructuredData(video);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <VideoPage video={video} />
      </>
    );
  } catch (error) {
    console.error('Error loading video:', error);
    notFound();
  }
}

// Generate static params for popular videos (optional)
export async function generateStaticParams() {
  try {
    const videos = await apiService.videos.getAll();
    return videos.slice(0, 10).map((video) => ({
      id: video.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
