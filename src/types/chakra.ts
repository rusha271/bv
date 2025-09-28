export interface ChakraPoint {
  id: string;
  name: string;
  direction: string;
  description: string;
  remedies: string;
  is_auspicious: boolean;
  should_avoid: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Frontend interface for form handling (camelCase)
export interface ChakraPointForm {
  id: string;
  name: string;
  direction: string;
  description: string;
  remedies: string;
  isAuspicious: boolean;
  shouldAvoid: boolean;
  imageUrl?: string;
}

export interface ChakraPointData {
  [key: string]: ChakraPoint;
}

// Utility functions to convert between backend and frontend formats
export const convertBackendToFrontend = (backendPoint: ChakraPoint): ChakraPointForm => ({
  id: backendPoint.id,
  name: backendPoint.name,
  direction: backendPoint.direction,
  description: backendPoint.description,
  remedies: backendPoint.remedies,
  isAuspicious: backendPoint.is_auspicious,
  shouldAvoid: backendPoint.should_avoid,
  imageUrl: backendPoint.image_url
});

export const convertFrontendToBackend = (frontendPoint: ChakraPointForm): Omit<ChakraPoint, 'created_at' | 'updated_at'> => ({
  id: frontendPoint.id,
  name: frontendPoint.name,
  direction: frontendPoint.direction,
  description: frontendPoint.description,
  remedies: frontendPoint.remedies,
  is_auspicious: frontendPoint.isAuspicious,
  should_avoid: frontendPoint.shouldAvoid,
  image_url: frontendPoint.imageUrl
});

// No default static data - all data comes from backend API
