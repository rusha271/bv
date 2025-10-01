import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiService, Video } from '@/utils/apiService';
import { buildTimeApiService, isBuildTime, BuildTimeVideo } from '@/utils/buildTimeApiService';
import { generateVideoMetaTags, generateVideoStructuredData, VideoSEOData } from '@/utils/seoUtils';
import VideoPage from './VideoPage';

// Type conversion function
function convertToVideoSEOData(video: Video | BuildTimeVideo): VideoSEOData {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    url: video.url,
    thumbnail: video.thumbnail_url || video.thumbnail,
    duration: video.duration || undefined,
    views: video.views,
    category: video.category,
    created_at: video.created_at,
  };
}

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
        title: 'Video Not Found | Brahma Vastu',
        description: 'The requested video could not be found.',
      };
    }

    let video;
    
    if (isBuildTime) {
      // During build time, use mock data
      try {
        video = await buildTimeApiService.videos.getById(videoId);
      } catch (error) {
        console.warn(`Build time: Video ${videoId} not found, using fallback`);
        video = null;
      }
    } else {
      // During runtime, use real API
      try {
        video = await apiService.videos.getById(videoId);
      } catch (error) {
        console.warn(`Runtime: Video ${videoId} not found`);
        video = null;
      }
    }
    
    if (!video) {
      return {
        title: 'Video Not Found | Brahma Vastu',
        description: 'The requested video could not be found.',
      };
    }

    const seoData = convertToVideoSEOData(video);
    const metaTags = generateVideoMetaTags(seoData);
    
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
      title: `Video ${params.id} | Brahma Vastu`,
      description: 'Watch Vastu videos and tutorials to learn about ancient Indian architecture principles.',
    };
  }
}

export default async function VideoPageRoute({ params }: VideoPageProps) {
  try {
    const videoId = parseInt(params.id);
    if (isNaN(videoId)) {
      notFound();
    }

    let video;
    
    if (isBuildTime) {
      // During build time, use mock data
      try {
        video = await buildTimeApiService.videos.getById(videoId);
      } catch (error) {
        console.warn(`Build time: Video ${videoId} not found, using fallback`);
        video = null;
      }
    } else {
      // During runtime, use real API
      try {
        video = await apiService.videos.getById(videoId);
      } catch (error) {
        console.warn(`Runtime: Video ${videoId} not found`);
        video = null;
      }
    }
    
    if (!video) {
      notFound();
    }

    const seoData = convertToVideoSEOData(video);
    const structuredData = generateVideoStructuredData(seoData);

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

// Generate static params for popular videos
export async function generateStaticParams() {
  try {
    if (isBuildTime) {
      // During build time, use mock data
      console.log('Build time detected: Using mock video data');
      const videos = await buildTimeApiService.videos.getAll();
      return videos.map((video) => ({
        id: video.id.toString(),
      }));
    }

    // Try to fetch videos from API
    const videos = await apiService.videos.getAll();
    if (videos && videos.length > 0) {
      return videos.slice(0, 10).map((video) => ({
        id: video.id.toString(),
      }));
    }
    
    // Fallback to mock data if API returns empty
    console.log('API returned empty results, using mock video data');
    const mockVideos = await buildTimeApiService.videos.getAll();
    return mockVideos.map((video) => ({
      id: video.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    console.log('Using fallback mock video data');
    // Return mock video IDs as fallback
    const mockVideos = await buildTimeApiService.videos.getAll();
    return mockVideos.map((video) => ({
      id: video.id.toString(),
    }));
  }
}
