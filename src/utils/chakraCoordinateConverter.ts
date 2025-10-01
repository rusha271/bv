// Utility to convert GIMP coordinates to angle/distance format for CircularImagePoints
import { ChakraPoint as ChakraPointData } from '@/types/chakra';

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

// Updated GIMP coordinates with proper chakra positioning
export const gimpCoordinates: { [key: string]: GimpCoordinate } = {
  // Main 16 directions positioned in the outer ring of the chakra
  'North': { x: 1236.0, y: 304.0 },      // 0 degrees - Top center
  'NNE': { x: 1592.6, y: 368.0 },        // 22.5 degrees
  'NE': { x: 1889.9, y: 575.8 },         // 45 degrees
  'ENE': { x: 2093.1, y: 878.3 },         // 67.5 degrees
  'East': { x: 2169.8, y: 1232.8 },       // 90 degrees - Right center
  'ESE': { x: 2095.3, y: 1594.1 },       // 112.5 degrees
  'SE': { x: 1894.4, y: 1894.4 },         // 135 degrees
  'SSE': { x: 1230.6, y: 2163.1 },       // 157.5 degrees
  'South': { x: 882.8, y: 2093.1 },       // 180 degrees - Bottom center
  'SSW': { x: 573.5, y: 1894.4 },        // 202.5 degrees
  'SW': { x: 368.0, y: 1585.0 },         // 225 degrees
  'WSW': { x: 300.3, y: 1235.1 },        // 247.5 degrees
  'West': { x: 377.1, y: 873.8 },         // 270 degrees - Left center
  'WNW': { x: 575.8, y: 578.0 },         // 292.5 degrees
  'NW': { x: 876.1, y: 372.6 },          // 315 degrees
  'NNW': { x: 1236.0, y: 304.0 },        // 337.5 degrees

  // Legacy 32-point system (S1-S8, W1-W8, N1-N8, E1-E8) - keeping for backward compatibility
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
  'W2': { x: 840.5, y: 499.7 },
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

// Static content for all 16 directions
export const chakraDirectionContent: { [key: string]: { name: string; description: string; remedies: string; isAuspicious: boolean; shouldAvoid: boolean } } = {
  'North': {
    name: 'North',
    description: 'Money, Growth, Promotions, New opportunities, Franchises, Wealth (Kuber), Sales',
    remedies: 'Place money plants, water features, or wealth symbols in the North direction. Keep this area clean and well-lit to attract financial prosperity.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'NNE': {
    name: 'North North East',
    description: 'Health, Immunity, Recovery, Enthusiasm, Medical care, Healing',
    remedies: 'Place healing crystals, medicinal plants, or health-related symbols. Keep this area clutter-free and well-ventilated.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'NE': {
    name: 'North East',
    description: 'Clarity, Peace, Hope, Mental stability, Illness',
    remedies: 'Place meditation spaces, study areas, or spiritual symbols. Avoid heavy furniture or clutter in this direction.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'ENE': {
    name: 'East North East',
    description: 'Fun, Happiness, Recreation, Humor',
    remedies: 'Create entertainment areas, gaming spaces, or recreational zones. Use bright colors and playful decorations.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'East': {
    name: 'East',
    description: 'Social connections, Public events, Gatherings, Networking, Government, Marketing',
    remedies: 'Place networking areas, meeting spaces, or communication devices. Keep this area active and well-connected.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'ESE': {
    name: 'East South East',
    description: 'Analysis, Reflection, Anxiety, In-laws, Power of manifestation',
    remedies: 'Create quiet study or reflection areas. Use calming colors and avoid excessive stimulation.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'SE': {
    name: 'South East',
    description: 'Cash, Liquidity, Fire, New beginnings, Vital spark, Speed',
    remedies: 'Place fire elements, cash registers, or new project areas. Keep this area energized and active.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'SSE': {
    name: 'South South East',
    description: 'Power, Conflict, Confidence, Courage, Authority',
    remedies: 'Create leadership spaces, decision-making areas, or authority symbols. Use strong, confident colors.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'South': {
    name: 'South',
    description: 'Fame, Politicians, Influential people, High-ranking government officials, Rising status',
    remedies: 'Place recognition displays, awards, or status symbols. Keep this area prominent and well-maintained.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'SSW': {
    name: 'South South West',
    description: 'Artistry, Discarding, Spending, Instincts',
    remedies: 'Create artistic spaces, creative areas, or disposal zones. Use creative and intuitive design elements.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'SW': {
    name: 'South West',
    description: 'Bonding, Relationship skills, Stability, Heaviness, Ancestors (Pitra)',
    remedies: 'Place family photos, relationship symbols, or ancestral items. Use grounding and stable elements.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'WSW': {
    name: 'West South West',
    description: 'Education, Knowledge, Expertise, Protection, Commission',
    remedies: 'Create study areas, knowledge centers, or learning spaces. Place educational materials and protective symbols.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'West': {
    name: 'West',
    description: 'Profitability, Gains, Manifesting, Accomplishments, Self-awareness, Enlightenment, Desires',
    remedies: 'Place achievement displays, goal boards, or manifestation tools. Keep this area focused on accomplishments.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'WNW': {
    name: 'West North West',
    description: 'Cleansing, Depression, Dryness, Lack of motivation, Self-reflection',
    remedies: 'Create cleansing areas, meditation spaces, or motivational displays. Use uplifting colors and inspiring elements.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'NW': {
    name: 'North West',
    description: 'Mood swings, Support, Banks, Administration',
    remedies: 'Place support systems, administrative areas, or banking-related items. Use stable and supportive elements.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'NNW': {
    name: 'North North West',
    description: 'Attraction, Pleasures in bed, Charm, Sex, Passion, Intimacy, Spirituality',
    remedies: 'Create intimate spaces, romantic areas, or spiritual sanctuaries. Use sensual and spiritual elements.',
    isAuspicious: true,
    shouldAvoid: false
  }
};

// Convert GIMP coordinates to angle/distance format with separated inner/outer circles
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

  const points: ChakraPoint[] = [];

  Object.entries(gimpCoordinates).forEach(([id, coord]) => {
    // Calculate distance from center
    const deltaX = coord.x - centerX;
    const deltaY = coord.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Calculate angle (0 degrees = East, 90 degrees = North)
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    // Normalize angle to 0-360 range
    const normalizedAngle = (angle + 360) % 360;
    
    // Determine color based on chakra point properties
    let color = '#f59e0b'; // Default orange
    
    // Check if it's one of the 16 main directions
    if (chakraDirectionContent[id]) {
      color = chakraDirectionContent[id].shouldAvoid ? '#ef4444' : 
              chakraDirectionContent[id].isAuspicious ? '#10b981' : '#f59e0b';
    } else {
      // Legacy 32-point system color logic
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
    }
    
    // Check if this is a 16 main direction (for inner circle)
    const isMainDirection = chakraDirectionContent[id];
    
    // Check if this is a legacy 32-point direction (for outer circle)
    const isLegacyDirection = !isMainDirection && (
      id.startsWith('N') || id.startsWith('E') || id.startsWith('S') || id.startsWith('W')
    );
    
    // Inner circle (1.1) - only 16 main directions
    if (isMainDirection) {
      points.push({
        id: `${id}_inner`,
        angle: normalizedAngle,
        distance: 1.24,
        color,
        label: id
      });
    }
    
    // Outer circle (1.24) - only 32 legacy directions
    if (isLegacyDirection) {
      points.push({
        id: `${id}_outer`,
        angle: normalizedAngle,
        distance: 1.1,
        color,
        label: id
      });
    }
  });

  return points;
};

// Get chakra points in the correct order for display (16 main directions - inner circle only)
export const getChakraPointsInOrder = (): ChakraPoint[] => {
  const allPoints = convertGimpToCircular();
  
  // Define the order of the 16 main directions (clockwise from North)
  const segmentOrder = [
    'North', 'NNE', 'NE', 'ENE', 'East', 'ESE', 'SE', 'SSE',
    'South', 'SSW', 'SW', 'WSW', 'West', 'WNW', 'NW', 'NNW'
  ];
  
  // Return only inner points (16 main directions at distance 1.1)
  const orderedPoints: ChakraPoint[] = [];
  segmentOrder.forEach(id => {
    const innerPoint = allPoints.find(point => point.id === `${id}_inner`);
    if (innerPoint) orderedPoints.push(innerPoint);
  });
  
  return orderedPoints;
};

// Get legacy 32-point system in the correct order for display (outer circle only)
export const getLegacyChakraPointsInOrder = (): ChakraPoint[] => {
  const allPoints = convertGimpToCircular();
  
  // Define the order of segments as they appear on the chakra (clockwise from North)
  const segmentOrder = [
    'N1', 'N2', 'N3', 'N4' , 'N5', 'N6', 'N7', 'N8', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'W1', 'W2', 'W3', 'W4',
    'W5', 'W6', 'W7', 'W8'
  ];
  
  // Return only outer points (32 legacy directions at distance 1.24)
  const orderedPoints: ChakraPoint[] = [];
  segmentOrder.forEach(id => {
    const outerPoint = allPoints.find(point => point.id === `${id}_outer`);
    if (outerPoint) orderedPoints.push(outerPoint);
  });
  
  return orderedPoints;
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

// Helper function to get static content for a direction
export const getDirectionContent = (directionId: string) => {
  return chakraDirectionContent[directionId] || null;
};

// Helper function to get all 16 main directions with their content
export const getAllDirectionContent = () => {
  return chakraDirectionContent;
};

// Helper function to get 16 main directions as ChakraPointData objects with static content
export const getMainDirectionsWithContent = (): ChakraPointData[] => {
  const allPoints = convertGimpToCircular();
  
  // Define the order of the 16 main directions (clockwise from North)
  const segmentOrder = [
    'North', 'NNE', 'NE', 'ENE', 'East', 'ESE', 'SE', 'SSE',
    'South', 'SSW', 'SW', 'WSW', 'West', 'WNW', 'NW', 'NNW'
  ];
  
  return segmentOrder.map(id => {
    const point = allPoints.find(point => point.id === id);
    const content = chakraDirectionContent[id];
    
    if (point && content) {
      return {
        id: point.id,
        name: content.name,
        direction: content.name,
        description: content.description,
        remedies: content.remedies,
        is_auspicious: content.isAuspicious,
        should_avoid: content.shouldAvoid,
        image_url: undefined,
        created_at: undefined,
        updated_at: undefined
      } as ChakraPointData;
    }
    return point;
  }).filter(Boolean) as ChakraPointData[];
};

// Helper function to get all 16 main directions as a data object (similar to API format)
export const getMainDirectionsData = (): { [key: string]: ChakraPointData } => {
  const directions = getMainDirectionsWithContent();
  const dataObject: { [key: string]: ChakraPointData } = {};
  
  directions.forEach(direction => {
    dataObject[direction.id] = direction;
  });
  
  return dataObject;
};

// Helper function to get all legacy 32-point system as ChakraPointData objects with static content
export const getLegacyPointsWithContent = (): ChakraPointData[] => {
  const allPoints = convertGimpToCircular();
  
  // Define the order of segments as they appear on the chakra (clockwise from North)
  const segmentOrder = [
    'N1', 'N2', 'N3', 'N4' , 'N5', 'N6', 'N7', 'N8', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'W1', 'W2', 'W3', 'W4',
    'W5', 'W6', 'W7', 'W8'
  ];
  
  return segmentOrder.map(id => {
    const point = allPoints.find(point => point.id === `${id}_outer`);
    
    if (point) {
      // Create basic content for legacy points
      const direction = id.charAt(0); // N, E, S, W
      const number = id.substring(1); // 1, 2, 3, etc.
      
      // Determine if this is an auspicious point based on the legacy color logic
      const isAuspicious = (id === 'N3' || id === 'N4' || id === 'N5' || 
                           id === 'E3' || id === 'E4' || 
                           id === 'S3' || id === 'S4' || 
                           id === 'W3' || id === 'W4');
      
      const shouldAvoid = (id === 'E7' || id === 'E8' || 
                          id === 'S5' || id === 'S6' || id === 'S7' || id === 'S8' ||
                          id === 'W1' || id === 'W8' || 
                          id === 'N1' || id === 'N2' || id === 'N7' || id === 'N8');
      
      return {
        id: point.id,
        name: `${direction}${number}`,
        direction: `${direction}${number}`,
        description: `Legacy chakra point ${direction}${number} - ${isAuspicious ? 'Auspicious' : shouldAvoid ? 'Avoid' : 'Neutral'} energy`,
        remedies: isAuspicious ? 
          `Place positive energy elements in this direction. Keep this area clean and well-lit.` :
          shouldAvoid ? 
          `Avoid heavy furniture or negative energy in this direction. Use light, positive elements.` :
          `This direction has neutral energy. Use balanced elements.`,
        is_auspicious: isAuspicious,
        should_avoid: shouldAvoid,
        image_url: undefined,
        created_at: undefined,
        updated_at: undefined
      } as ChakraPointData;
    }
    return null;
  }).filter(Boolean) as ChakraPointData[];
};

// Helper function to get all chakra points (both main directions and legacy points) as a data object
export const getAllChakraPointsData = (): { [key: string]: ChakraPointData } => {
  const mainDirections = getMainDirectionsData();
  const legacyPoints = getLegacyPointsWithContent();
  const dataObject: { [key: string]: ChakraPointData } = {};
  
  // Add main directions
  Object.entries(mainDirections).forEach(([key, value]) => {
    dataObject[key] = value;
  });
  
  // Add legacy points
  legacyPoints.forEach(point => {
    dataObject[point.id] = point;
  });
  
  return dataObject;
};