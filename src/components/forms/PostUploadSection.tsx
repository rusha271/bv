import React from 'react';
import { useAuthUser } from '@/contexts/AuthContext';
import UnifiedPostCreator from './UnifiedPostCreator';

// Legacy types - kept for backward compatibility
export type TipComponentType = 'title' | 'author' | 'image' | 'content' | 'notes' | 'link';

export interface TipComponent {
  id: string;
  type: TipComponentType;
  label: string;
  required: boolean;
  data?: any;
}

export interface CustomizableTipData {
  components: TipComponent[];
  category?: string;
}

interface PostUploadSectionProps {
  onUpload?: () => void;
}

/**
 * Unified Post Upload Section
 * 
 * This component provides a single interface for creating multiple types of content:
 * - Tips
 * - Books  
 * - Videos
 * - Podcasts
 * 
 * Features:
 * - Drag and drop component reordering
 * - Dynamic component addition/removal
 * - Real-time preview
 * - Multi-post creation in one session
 * - Single submit button for all posts
 * - Validation and error handling
 */
export default function PostUploadSection({ onUpload }: PostUploadSectionProps) {
  const user = useAuthUser();
  const isAdmin = user?.role?.name === 'admin';

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  return <UnifiedPostCreator onUpload={onUpload} />;
}
