'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  color: number;
  description: string;
  facts: string;
  meanLongitude: number;
  dailyMotion: number;
  eccentricity: number;
  inclination: number;
  remedy: string;
}

interface PlanetaryDataContextType {
  planetsData: PlanetData[];
}

const PlanetaryDataContext = createContext<PlanetaryDataContextType | null>(null);

export const PlanetaryDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planetsData, setPlanetsData] = useState<PlanetData[]>([
    { name: 'Mercury', radius: 0.4, distance: 8, orbitalPeriod: 87.97, color: 0x8C7853, description: 'Closest planet to the Sun', facts: 'Temperature: -173°C to 427°C', meanLongitude: 252.25, dailyMotion: 4.0923, eccentricity: 0.2056, inclination: 7.00, remedy: 'Wear green clothes and donate to education.' },
    { name: 'Venus', radius: 0.95, distance: 12, orbitalPeriod: 224.70, color: 0xFFC649, description: 'Hottest planet in our solar system', facts: 'Surface temperature: 462°C', meanLongitude: 181.98, dailyMotion: 1.6021, eccentricity: 0.0067, inclination: 3.39, remedy: 'Offer white flowers and practice gratitude.' },
    { name: 'Earth', radius: 1, distance: 16, orbitalPeriod: 365.26, color: 0x6B93D6, description: 'Our home planet', facts: '71% of surface covered by water', meanLongitude: 100.47, dailyMotion: 0.9856, eccentricity: 0.0167, inclination: 0.00, remedy: 'Spend time in nature and ground yourself.' },
    { name: 'Mars', radius: 0.53, distance: 24, orbitalPeriod: 686.98, color: 0xCD5C5C, description: 'The Red Planet', facts: 'Has the largest volcano in the solar system', meanLongitude: 355.43, dailyMotion: 0.5240, eccentricity: 0.0935, inclination: 1.85, remedy: 'Practice physical exercise and channel energy positively.' },
    { name: 'Jupiter', radius: 4, distance: 40, orbitalPeriod: 4332.59, color: 0xD8CA9D, description: 'Largest planet in our solar system', facts: 'Has over 80 known moons', meanLongitude: 34.35, dailyMotion: 0.0831, eccentricity: 0.0489, inclination: 1.31, remedy: 'Meditate and seek wisdom from elders.' },
    { name: 'Saturn', radius: 3.2, distance: 55, orbitalPeriod: 10759.22, color: 0xFAD5A5, description: 'The ringed planet', facts: 'Has spectacular ring system', meanLongitude: 50.08, dailyMotion: 0.0334, eccentricity: 0.0565, inclination: 2.49, remedy: 'Practice patience and help others.' },
    { name: 'Uranus', radius: 2, distance: 70, orbitalPeriod: 30688.5, color: 0x4FD0E3, description: 'Ice giant tilted on its side', facts: 'Rotates on its side at 98° tilt', meanLongitude: 314.05, dailyMotion: 0.0117, eccentricity: 0.0457, inclination: 0.77, remedy: 'Embrace change and think outside the box.' },
    { name: 'Neptune', radius: 1.9, distance: 85, orbitalPeriod: 60182, color: 0x4B70DD, description: 'Windiest planet in the solar system', facts: 'Wind speeds up to 2,100 km/h', meanLongitude: 304.35, dailyMotion: 0.0060, eccentricity: 0.0113, inclination: 1.77, remedy: 'Engage in creative activities and dream journaling.' },
  ]);

  // Placeholder for future API fetch
  useEffect(() => {
    // Example: fetch('/api/planetary-data').then(res => res.json()).then(data => setPlanetsData(data));
  }, []);

  return (
    <PlanetaryDataContext.Provider value={{ planetsData }}>
      {children}
    </PlanetaryDataContext.Provider>
  );
};

export const usePlanetaryData = () => {
  const context = useContext(PlanetaryDataContext);
  if (!context) {
    throw new Error('usePlanetaryData must be used within a PlanetaryDataProvider');
  }
  return context;
};