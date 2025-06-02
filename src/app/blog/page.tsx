"use client";

import React from "react";
import { VastuTipsProvider } from "@/contexts/VastuTipsContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BlogCardsList from "@/components/BlogCardsList";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function BlogPage() {
  const { theme } = useThemeContext();

  return (
    <VastuTipsProvider>
      <div
        className="relative min-h-screen"
        style={{ background: theme.palette.background.default }}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 -z-10 animate-gradient"
          style={{
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.secondary.light} 100%)`,
          }}
        />
        <Navbar />
        {/* Main content container visually separated from header */}
        <main
          className="max-w-6xl mx-auto rounded-2xl shadow-2xl p-6 mt-28 mb-8 border"
          style={{
            background: theme.palette.background.paper,
            borderColor: theme.palette.divider,
          }}
        >
          <h1
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: theme.palette.text.primary }}
          >
            Vastu Tips and Guidelines
          </h1>
          <BlogCardsList />
        </main>
        <Footer />
      </div>
    </VastuTipsProvider>
  );
}