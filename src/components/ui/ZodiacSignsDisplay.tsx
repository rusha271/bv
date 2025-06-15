"use client";

import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import ZodiacSignCard from "@/components/ZodiacSignCard";

const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    planet: "Mars",
    element: "Fire",
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    remedy: "Wear red clothes, donate red items, and practice courage.",
  },
  {
    name: "Taurus",
    symbol: "♉",
    planet: "Venus",
    element: "Earth",
    mantra: "ॐ शुं शुक्राय नमः",
    remedy: "Wear white clothes, offer white flowers, and practice gratitude.",
  },
  {
    name: "Gemini",
    symbol: "♊",
    planet: "Mercury",
    element: "Air",
    mantra: "ॐ बुं बुधाय नमः",
    remedy: "Wear green clothes, donate to education, and practice communication.",
  },
  {
    name: "Cancer",
    symbol: "♋",
    planet: "Moon",
    element: "Water",
    mantra: "ॐ सोम सोमाय नमः",
    remedy: "Wear white/silver clothes, offer milk to Shiva, and practice emotional balance.",
  },
  {
    name: "Leo",
    symbol: "♌",
    planet: "Sun",
    element: "Fire",
    mantra: "ॐ ह्रीं ह्रौं सः सूर्याय नमः",
    remedy: "Wear golden clothes, donate to temples, and practice leadership.",
  },
  {
    name: "Virgo",
    symbol: "♍",
    planet: "Mercury",
    element: "Earth",
    mantra: "ॐ बुं बुधाय नमः",
    remedy: "Wear green clothes, serve others, and practice organization.",
  },
  {
    name: "Libra",
    symbol: "♎",
    planet: "Venus",
    element: "Air",
    mantra: "ॐ शुं शुक्राय नमः",
    remedy: "Wear white/pink clothes, maintain harmony, and practice justice.",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    planet: "Mars",
    element: "Water",
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    remedy: "Wear red clothes, practice meditation, and channel energy positively.",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    planet: "Jupiter",
    element: "Fire",
    mantra: "ॐ बृं बृहस्पतये नमः",
    remedy: "Wear yellow clothes, seek wisdom, and practice generosity.",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    planet: "Saturn",
    element: "Earth",
    mantra: "ॐ शं शनैश्चराय नमः",
    remedy: "Wear black/blue clothes, practice discipline, and help others.",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    planet: "Uranus",
    element: "Air",
    mantra: "ॐ ह्रीं ह्रौं सः राहवे नमः",
    remedy: "Wear blue clothes, embrace change, and practice innovation.",
  },
  {
    name: "Pisces",
    symbol: "♓",
    planet: "Neptune",
    element: "Water",
    mantra: "ॐ क्षं क्षीं क्षौं सः केतवे नमः",
    remedy: "Wear blue/white clothes, practice compassion, and engage in creative activities.",
  },
];

const ZodiacSignsDisplay: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <div
      className="w-full mt-4 p-3 rounded-2xl shadow-2xl"
      style={{ background: theme.palette.background.paper }}
    >
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: theme.palette.primary.main }}
      >
        Zodiac Signs and Planetary Influences
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {zodiacSigns.map((sign) => (
          <ZodiacSignCard
            key={sign.name}
            name={sign.name}
            symbol={sign.symbol}
            planet={sign.planet}
            element={sign.element}
            mantra={sign.mantra}
            remedy={sign.remedy}
          />
        ))}
      </div>
    </div>
  );
};

export default ZodiacSignsDisplay;