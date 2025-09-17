"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { Globe, Users, Plus, Minus } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";

// Dummy visitor data by country
const dummyVisitorData = [
  { country: "US", visitors: 1250, coordinates: [-95.7129, 37.0902] as [number, number]  },
  { country: "IN", visitors: 890, coordinates: [78.9629, 20.5937] as [number, number] },
  { country: "CA", visitors: 650, coordinates: [-106.3468, 56.1304] as [number, number] },
  { country: "GB", visitors: 520, coordinates: [-0.1278, 51.5074] as [number, number] },
  { country: "DE", visitors: 480, coordinates: [10.4515, 51.1657] as [number, number] },
  { country: "FR", visitors: 420, coordinates: [2.2137, 46.2276] as [number, number] },
  { country: "AU", visitors: 380, coordinates: [133.7751, -25.2744] as [number, number] },
  { country: "JP", visitors: 350, coordinates: [138.2529, 36.2048] as [number, number] },
  { country: "BR", visitors: 320, coordinates: [-51.9253, -14.235] as [number, number] },
  { country: "MX", visitors: 280, coordinates: [-102.5528, 23.6345] as [number, number] },
  { country: "IT", visitors: 250, coordinates: [12.5674, 41.8719] as [number, number] },
  { country: "ES", visitors: 220, coordinates: [-3.7492, 40.4637] as [number, number] },
  { country: "NL", visitors: 200, coordinates: [5.2913, 52.1326] as [number, number] },
  { country: "SE", visitors: 180, coordinates: [18.0686, 60.1282] as [number, number] },
  { country: "NO", visitors: 160, coordinates: [8.4689, 60.472] as [number, number] },
  { country: "DK", visitors: 140, coordinates: [9.5018, 56.2639] as [number, number] },
  { country: "FI", visitors: 120, coordinates: [25.7482, 61.9241] as [number, number] },
  { country: "CH", visitors: 100, coordinates: [8.2275, 46.8182] as [number, number] },
  { country: "AT", visitors: 90, coordinates: [14.5501, 47.5162] as [number, number] },
  { country: "BE", visitors: 80, coordinates: [4.3517, 50.8503] as [number, number] },
];

interface VisitorData {
  country: string;
  visitors: number;
  coordinates: [number, number];
}

export default function WorldMapVisitors() {
  const [visitorData, setVisitorData] = useState<VisitorData[]>(dummyVisitorData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { mode } = useThemeContext();

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setError(null);
        
        // In a real implementation, you would fetch from your analytics API
        // const response = await fetch('/api/analytics/visitors-by-country');
        // const data = await response.json();
        
        // For now, we'll use dummy data
        setVisitorData(dummyVisitorData);
      } catch (err) {
        console.error('Error fetching visitor data:', err);
        setError('Failed to load visitor data');
        // Keep using dummy data as fallback
      }
    };

    fetchVisitorData();
  }, []);

  const totalVisitors = visitorData.reduce((sum, country) => sum + country.visitors, 0);

  const handleMarkerMouseEnter = (country: VisitorData, event: any) => {
    setTooltipContent(`${country.country}: ${country.visitors.toLocaleString()} visitors`);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMarkerMouseLeave = () => {
    setTooltipContent("");
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 8));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  };

  if (loading) {
    return (
      <div className={`rounded-lg shadow p-6 ${
        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="animate-pulse">
          <div className={`h-6 rounded w-1/3 mb-4 ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-96 rounded ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg p-6 border ${
      mode === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>

      {error && (
        <div className={`rounded-lg p-4 mb-4 ${
          mode === 'dark' 
            ? 'bg-red-900 border border-red-700' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            mode === 'dark' ? 'text-red-300' : 'text-red-600'
          }`}>{error}</p>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-3">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Visitor Distribution
            </h3>
            <p className={`text-sm ${
              mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Global visitor analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-2 rounded-xl ${
            mode === 'dark' 
              ? 'bg-slate-700/50 text-slate-300' 
              : 'bg-slate-100/50 text-slate-600'
          }`}>
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {totalVisitors.toLocaleString()} total
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
              mode === 'dark' 
                ? 'bg-slate-700/50 text-slate-300' 
                : 'bg-slate-100/50 text-slate-600'
            }`}>
              {zoom}x
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === 'dark' 
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300' 
                    : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600'
                }`}
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 8}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === 'dark' 
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300' 
                    : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600'
                }`}
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-64 md:h-80 lg:h-96 w-full">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147
          }}
        >
        <ZoomableGroup minZoom={1} maxZoom={8} zoom={zoom}>
          <Geographies
            geography="/features.json"
            fill={mode === 'dark' ? "#374151" : "#E5E7EB"}
            stroke={mode === 'dark' ? "#4B5563" : "#D1D5DB"}
            strokeWidth={0.5}
          >
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={mode === 'dark' ? "#374151" : "#E5E7EB"}
                  stroke={mode === 'dark' ? "#4B5563" : "#D1D5DB"}
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>

          {visitorData.map(({ country, visitors, coordinates }) => (
            <Marker key={country} coordinates={coordinates}>
              <circle
                r={Math.max(4, Math.min(12, visitors / 50))}
                fill="#8B5CF6"
                fillOpacity={0.7}
                stroke="#7C3AED"
                strokeWidth={1}
                onMouseEnter={(e) => handleMarkerMouseEnter({ country, visitors, coordinates }, e)}
                onMouseLeave={handleMarkerMouseLeave}
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ))}
        </ZoomableGroup>


        </ComposableMap>

        {tooltipContent && (
          <div
            className={`absolute z-10 px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none ${
              mode === 'dark' 
                ? 'text-white bg-gray-900' 
                : 'text-white bg-gray-900'
            }`}
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className={`text-sm font-medium mb-2 ${
          mode === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Top Countries</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {visitorData
            .sort((a, b) => b.visitors - a.visitors)
            .slice(0, 8)
            .map((country) => (
              <div key={country.country} className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                mode === 'dark' ? 'bg-slate-700/50 hover:bg-slate-600/50' : 'bg-slate-100/50 hover:bg-slate-200/50'
              }`}>
                <span className={`text-xs font-medium ${
                  mode === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>{country.country}</span>
                <span className={`text-xs font-semibold ${
                  mode === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                }`}>{country.visitors.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 