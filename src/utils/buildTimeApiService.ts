// Build-time API service to handle cases when the API server is not available
// This prevents 404 errors during Next.js build process

export interface BuildTimeVideo {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  thumbnail?: string;
  duration?: string | null;
  views: number;
  category?: string;
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  video_type?: string;
}

// Mock video data for build time
const MOCK_VIDEOS: BuildTimeVideo[] = [
  {
    id: 4,
    title: "Vastu Shastra Fundamentals",
    description: "Learn the basic principles of Vastu Shastra and how they apply to modern homes.",
    url: "/videos/vastu-fundamentals.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "15:30",
    views: 1250,
    category: "Vastu Basics",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    is_published: true,
    video_type: "tutorial"
  },
  {
    id: 5,
    title: "Home Vastu Analysis",
    description: "Step-by-step guide to analyzing your home according to Vastu principles.",
    url: "/videos/home-vastu-analysis.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "22:45",
    views: 980,
    category: "Home Vastu",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    is_published: true,
    video_type: "tutorial"
  },
  {
    id: 6,
    title: "Office Vastu Guidelines",
    description: "Essential Vastu tips for creating a productive and harmonious office space.",
    url: "/videos/office-vastu-guidelines.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "18:20",
    views: 750,
    category: "Office Vastu",
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
    is_published: true,
    video_type: "tutorial"
  },
  {
    id: 7,
    title: "Vastu Remedies and Solutions",
    description: "Common Vastu problems and their effective remedies for better energy flow.",
    url: "/videos/vastu-remedies.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "25:10",
    views: 1100,
    category: "Vastu Remedies",
    created_at: "2024-02-01T16:45:00Z",
    updated_at: "2024-02-01T16:45:00Z",
    is_published: true,
    video_type: "tutorial"
  },
  {
    id: 8,
    title: "Chakra Points in Vastu",
    description: "Understanding the connection between Vastu and chakra energy points.",
    url: "/videos/chakra-points-vastu.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "20:35",
    views: 650,
    category: "Vastu Chakras",
    created_at: "2024-02-05T11:20:00Z",
    updated_at: "2024-02-05T11:20:00Z",
    is_published: true,
    video_type: "tutorial"
  },
  {
    id: 9,
    title: "Modern Vastu Applications",
    description: "How to apply ancient Vastu principles in contemporary architecture and design.",
    url: "/videos/modern-vastu-applications.mp4",
    thumbnail_url: "/images/bv.png",
    duration: "28:15",
    views: 890,
    category: "Modern Vastu",
    created_at: "2024-02-10T13:30:00Z",
    updated_at: "2024-02-10T13:30:00Z",
    is_published: true,
    video_type: "tutorial"
  }
];

export const buildTimeApiService = {
  videos: {
    getAll: async (): Promise<BuildTimeVideo[]> => {
      console.log('Build time: Returning mock videos data');
      return MOCK_VIDEOS;
    },
    
    getById: async (id: number): Promise<BuildTimeVideo | null> => {
      console.log(`Build time: Returning mock video data for ID ${id}`);
      const video = MOCK_VIDEOS.find(v => v.id === id);
      return video || null;
    }
  }
};

// Check if we're in build time
export const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL;
