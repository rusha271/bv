// Utility to convert GIMP coordinates to angle/distance format for CircularImagePoints

export interface GimpCoordinate {
  x: number;
  y: number;
}

export interface ChakraPoint {
  id: string;
  angle: number; // 0-360 degrees
  distance: number; // 0-1
  color?: string;
  label?: string;
}

// Corrected GIMP coordinates - Fixed the swapped directions
// The original coordinates were correct but the direction labels were swapped
export const gimpCoordinates: { [key: string]: GimpCoordinate } = {
  // North coordinates (corrected - these were originally labeled as East)
  'E1': { x: 1767.3, y: 1880.2 },
  'E2': { x: 1625.7, y: 1972.6 },
  'E3': { x: 1475.8, y: 2038.3 },
  'E4': { x: 1313.7, y: 2071.1 },
  'E5': { x: 1147.4, y: 2067.6 },
  'E6': { x: 989.4, y: 2036.2 },
  'E7': { x: 839.5, y: 1976.7 },
  'E8': { x: 697.9, y: 1882.3 },

  // East coordinates (corrected - these were originally labeled as North)
  'N1': { x: 1882.3, y: 702.6 },
  'N2': { x: 1970.5, y: 835.4 },
  'N3': { x: 2036.2, y: 993.5 },
  'N4': { x: 2064.9, y: 1151.5 },
  'N5': { x: 2067.0, y: 1315.7 },
  'N6': { x: 2062.2, y: 1475.8 },
  'N7': { x: 1947.6, y: 1627.7 },
  'N8': { x: 1882.3, y: 1763.2 },

  // South coordinates (corrected - these were originally labeled as West)
  'W1': { x: 702.0, y: 587.1 },
  'W2': { x: 839.5, y: 496.7 },
  'W3': { x: 993.5, y: 433.1 },
  'W4': { x: 1147.4, y: 402.3 },
  'W5': { x: 1315.7, y: 402.3 },
  'W6': { x: 1473.8, y: 435.2 },
  'W7': { x: 1631.8, y: 492.6 },
  'W8': { x: 1765.3, y: 587.1 },

  // West coordinates (corrected - these were originally labeled as South)
  'S1': { x: 578.8, y: 1759.1 },
  'S2': { x: 492.6, y: 1627.7 },
  'S3': { x: 429.6, y: 1477.9 },
  'S4': { x: 398.2, y: 1313.7 },
  'S5': { x: 402.3, y: 1149.5 },
  'S6': { x: 431.1, y: 989.4 },
  'S7': { x: 490.6, y: 837.5 },
  'S8': { x: 587.1, y: 702.0 }
};


// Convert GIMP coordinates to angle/distance format
export const convertGimpToCircular = (): ChakraPoint[] => {
  // Find the bounds of the GIMP coordinate system
  const allX = Object.values(gimpCoordinates).map(coord => coord.x);
  const allY = Object.values(gimpCoordinates).map(coord => coord.y);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  
  // Calculate the center of the GIMP coordinate system
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // Calculate the maximum distance from center
  const maxDistance = Math.max(
    Math.abs(maxX - centerX),
    Math.abs(maxY - centerY)
  );

  return Object.entries(gimpCoordinates).map(([id, coord]) => {
    // Calculate distance from center
    const deltaX = coord.x - centerX;
    const deltaY = coord.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Calculate angle (0 degrees = East, 90 degrees = North)
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    // Normalize angle to 0-360 range
    const normalizedAngle = (angle + 360) % 360;
    
    // Set a fixed distance to position points on the chakra text labels
    // This ensures all points are positioned at the same distance from center, on the text circle
    const normalizedDistance = 1.1; // Fixed distance to align with text labels
    
    // Determine color based on chakra point properties
    let color = '#f59e0b'; // Default orange
    
    // You can customize colors based on chakra properties here
    if (id === 'N3' || id === 'N4' || id === 'N5' || 
        id === 'E3' || id === 'E4' || 
        id === 'S3' || id === 'S4' || 
        id === 'W3' || id === 'W4') {
      color = '#10b981'; // Green for auspicious points
    } else if (id === 'E7' || id === 'E8' || 
               id === 'S5' || id === 'S6' || id === 'S7' || id === 'S8' ||
               id === 'W1' || id === 'W8' || 
               id === 'N1' || id === 'N2' || id === 'N7' || id === 'N8') {
      color = '#ef4444'; // Red for points to avoid
    }
    
    return {
      id,
      angle: normalizedAngle,
      distance: normalizedDistance,
      color,
      label: id
    };
  });
};

// Get chakra points in the correct order for display
export const getChakraPointsInOrder = (): ChakraPoint[] => {
  const allPoints = convertGimpToCircular();
  
  // Define the order of segments as they appear on the chakra (clockwise from North)
  const segmentOrder = [
    'N1', 'N2', 'N3', 'N4' , 'N5', 'N6', 'N7', 'N8', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'W1', 'W2', 'W3', 'W4',
    'W5', 'W6', 'W7', 'W8'
  ];
  
  return segmentOrder.map(id => allPoints.find(point => point.id === id)).filter(Boolean) as ChakraPoint[];
};

// Mapping from coordinate-based IDs to numeric IDs used by the API
export const coordinateToNumericMap: { [key: string]: string } = {
  'N1': '8', 'N2': '9', 'N3': '10', 'N4': '11', 'N5': '12', 'N6': '13', 'N7': '14', 'N8': '15',
  'E1': '0', 'E2': '1', 'E3': '2', 'E4': '3', 'E5': '4', 'E6': '5', 'E7': '6', 'E8': '7',
  'S1': '16', 'S2': '17', 'S3': '18', 'S4': '19', 'S5': '20', 'S6': '21', 'S7': '22', 'S8': '23',
  'W1': '24', 'W2': '25', 'W3': '26', 'W4': '27', 'W5': '28', 'W6': '29', 'W7': '30', 'W8': '31'
};

// Helper function to get the numeric ID for a coordinate-based ID
export const getNumericId = (coordinateId: string): string | undefined => {
  return coordinateToNumericMap[coordinateId];
};