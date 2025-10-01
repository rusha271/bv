// Unified content type definitions for customizable posts

export type ContentType = 'tip' | 'book' | 'video' | 'podcast';

export type ComponentType = 
  | 'title' 
  | 'author' 
  | 'image' 
  | 'content' 
  | 'notes' 
  | 'link'
  | 'summary'
  | 'description'
  | 'file'
  | 'rating'
  | 'pages'
  | 'price'
  | 'publication_year'
  | 'publisher'
  | 'isbn'
  | 'category'
  | 'duration'
  | 'episode'
  | 'thumbnail';

export interface ContentComponent {
  id: string;
  type: ComponentType;
  label: string;
  required: boolean;
  data?: any;
  contentType?: ContentType; // Which content type this component belongs to
}

export interface CustomizablePost {
  id: string;
  contentType: ContentType;
  components: ContentComponent[];
  category?: string;
  status: 'draft' | 'ready' | 'uploading' | 'uploaded' | 'error';
  error?: string;
}

export interface ComponentTypeConfig {
  label: string;
  required: boolean;
  icon: string;
  inputType: 'text' | 'textarea' | 'number' | 'file' | 'select' | 'url';
  accept?: string; // For file inputs
  options?: string[]; // For select inputs
  contentType?: ContentType[]; // Which content types can use this component
}

// Available component types with their configurations
export const componentTypes: Record<ComponentType, ComponentTypeConfig> = {
  // Common components
  title: { 
    label: 'Title', 
    required: true, 
    icon: '📝', 
    inputType: 'text',
    contentType: ['tip', 'book', 'video', 'podcast']
  },
  author: { 
    label: 'Author/Creator', 
    required: false, 
    icon: '👤', 
    inputType: 'text',
    contentType: ['tip', 'book', 'video', 'podcast']
  },
  content: { 
    label: 'Content', 
    required: true, 
    icon: '📄', 
    inputType: 'textarea',
    contentType: ['tip']
  },
  summary: { 
    label: 'Summary', 
    required: true, 
    icon: '📖', 
    inputType: 'textarea',
    contentType: ['book']
  },
  description: { 
    label: 'Description', 
    required: true, 
    icon: '📝', 
    inputType: 'textarea',
    contentType: ['video', 'podcast']
  },
  image: { 
    label: 'Image', 
    required: true, 
    icon: '🖼️', 
    inputType: 'file',
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    contentType: ['tip']
  },
  file: { 
    label: 'File', 
    required: true, 
    icon: '📁', 
    inputType: 'file',
    accept: 'application/pdf,video/mp4,video/webm,video/avi,video/mov,audio/mp3,audio/wav,audio/ogg',
    contentType: ['book', 'video', 'podcast']
  },
  notes: { 
    label: 'Notes', 
    required: false, 
    icon: '📋', 
    inputType: 'textarea',
    contentType: ['tip', 'book', 'video', 'podcast']
  },
  link: { 
    label: 'Link', 
    required: false, 
    icon: '🔗', 
    inputType: 'url',
    contentType: ['tip', 'book', 'video', 'podcast']
  },
  category: { 
    label: 'Category', 
    required: false, 
    icon: '🏷️', 
    inputType: 'select',
    options: ['Vastu Tips', 'Home Consultation', 'Tutorial', 'General'],
    contentType: ['tip', 'book', 'video', 'podcast']
  },
  
  // Book-specific components
  rating: { 
    label: 'Rating', 
    required: false, 
    icon: '⭐', 
    inputType: 'number',
    contentType: ['book']
  },
  pages: { 
    label: 'Pages', 
    required: false, 
    icon: '📄', 
    inputType: 'number',
    contentType: ['book']
  },
  price: { 
    label: 'Price', 
    required: false, 
    icon: '💰', 
    inputType: 'number',
    contentType: ['book']
  },
  publication_year: { 
    label: 'Publication Year', 
    required: false, 
    icon: '📅', 
    inputType: 'number',
    contentType: ['book']
  },
  publisher: { 
    label: 'Publisher', 
    required: false, 
    icon: '🏢', 
    inputType: 'text',
    contentType: ['book']
  },
  isbn: { 
    label: 'ISBN', 
    required: false, 
    icon: '🔢', 
    inputType: 'text',
    contentType: ['book']
  },
  
  // Podcast-specific components
  duration: { 
    label: 'Duration', 
    required: false, 
    icon: '⏱️', 
    inputType: 'text',
    contentType: ['podcast']
  },
  episode: { 
    label: 'Episode Number', 
    required: false, 
    icon: '🎙️', 
    inputType: 'number',
    contentType: ['podcast']
  },
  thumbnail: { 
    label: 'Thumbnail', 
    required: false, 
    icon: '🖼️', 
    inputType: 'file',
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    contentType: ['podcast']
  },
};

// Default component sets for each content type
export const defaultComponents: Record<ContentType, ComponentType[]> = {
  tip: ['title', 'content', 'image', 'category'],
  book: ['title', 'author', 'summary', 'file', 'category'],
  video: ['title', 'description', 'file', 'category'],
  podcast: ['title', 'description', 'file', 'category', 'duration', 'thumbnail']
};

// Content type configurations
export const contentTypeConfig: Record<ContentType, { label: string; icon: string; color: string }> = {
  tip: { label: 'Tip', icon: '💡', color: '#f59e0b' },
  book: { label: 'Book', icon: '📚', color: '#3b82f6' },
  video: { label: 'Video', icon: '🎥', color: '#ef4444' },
  podcast: { label: 'Podcast', icon: '🎧', color: '#8b5cf6' }
};
