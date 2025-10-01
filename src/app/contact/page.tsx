'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Box from '@mui/material/Box';
import { Phone, Mail, MapPin, Clock, Star, Calendar, Play, X, Sparkles, Users, Award, Shield, Zap, FileText, Scale, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiService from '@/utils/apiService';

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '200px',
        animation: 'fadein 0.6s ease-out',
      }}
    >
      {children}
    </div>
  );
}

function TeamMemberBox({ member, imageOnRight = false }: { member: any, imageOnRight?: boolean }) {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile } = useDeviceType();
  const [isClicked, setIsClicked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
    }
    setIsClicked(false);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{
        background: isDarkMode
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => setIsClicked(true)}
    >
      {/* Video Player */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-500 transform ${
          isClicked ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {isClicked ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              autoPlay
            >
              <source src={member.video || "https://www.w3schools.com/html/mov_bbb.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
              <p>Introduction Video</p>
              <p className="text-sm opacity-80 mt-2">Click to play</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex ${imageOnRight ? 'flex-row-reverse' : 'flex-row'} ${
          isMobile ? 'flex-col' : ''
        } items-center p-6 transition-all duration-500`}
      >
        {/* Image Section */}
        <div
          className={`relative ${isMobile ? 'mb-4 w-full' : 'w-1/3'} flex ${
            imageOnRight ? 'justify-end' : 'justify-start'
          } transition-transform duration-500 transform ${isClicked ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 rounded-full object-cover"
            style={{ maxWidth: '100%' }}
          />
        </div>

        {/* Content Section */}
        <div
          className={`relative ${isMobile ? 'w-full' : 'w-2/3'} px-4 transition-transform duration-500 transform ${
            isClicked ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <h3
            className="text-xl font-bold mb-2"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {member.name}
          </h3>
          <p
            className="font-semibold mb-3"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {member.title}
          </p>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: theme.palette.text.secondary }}
          >
            {member.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(59, 130, 246, 0.1)',
                  color: isDarkMode ? '#60a5fa' : '#1e40af',
                  border: isDarkMode
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 p-2 rounded-lg"
              style={{
                background: isDarkMode
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(34, 197, 94, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <Star className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                {member.experience}
              </span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg"
              style={{
                background: isDarkMode
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(34, 197, 94, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <Star className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                {member.clients}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultantBox({ member, imageOnRight = false }: { member: any, imageOnRight?: boolean }) {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile } = useDeviceType();
  const [isClicked, setIsClicked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
    }
    setIsClicked(false);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{
        background: isDarkMode
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => setIsClicked(true)}
    >
      {/* Video Player */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-500 transform ${
          isClicked ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {isClicked ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              autoPlay
            >
              <source src={member.video || "https://www.w3schools.com/html/mov_bbb.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
              <p>Introduction Video</p>
              <p className="text-sm opacity-80 mt-2">Click to play</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex ${imageOnRight ? 'flex-row-reverse' : 'flex-row'} ${
          isMobile ? 'flex-col' : ''
        } items-center p-6 transition-all duration-500`}
      >
        {/* Image Section */}
        <div
          className={`relative ${isMobile ? 'mb-4 w-full' : 'w-1/3'} flex ${
            imageOnRight ? 'justify-end' : 'justify-start'
          } transition-transform duration-500 transform ${isClicked ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 rounded-full object-cover"
            style={{ maxWidth: '100%' }}
          />
        </div>

        {/* Content Section */}
        <div
          className={`relative ${isMobile ? 'w-full' : 'w-2/3'} px-4 transition-transform duration-500 transform ${
            isClicked ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <h3
            className="text-xl font-bold mb-2"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {member.name}
          </h3>
          <p
            className="font-semibold mb-3"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {member.title}
          </p>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: theme.palette.text.secondary }}
          >
            {member.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(59, 130, 246, 0.1)',
                  color: isDarkMode ? '#60a5fa' : '#1e40af',
                  border: isDarkMode
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 p-2 rounded-lg"
              style={{
                background: isDarkMode
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(34, 197, 94, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <Star className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                {member.experience}
              </span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg"
              style={{
                background: isDarkMode
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(34, 197, 94, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <Star className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span style={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                {member.clients}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModernContactPage() {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const { isMobile, isTablet } = useDeviceType();
  const sectionTitleSize = isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem';
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [minDateTime, setMinDateTime] = useState('');
  
  // Modal states
  
  // Calculate default date immediately to avoid controlled/uncontrolled input issues
  const getDefaultDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: '',
    message: '',
    preferred_date: getDefaultDateTime(),
  });

  // Set tomorrow's date only on client side to prevent hydration mismatch
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Set to 9:00 AM tomorrow
    
    const tomorrowDateTime = tomorrow.toISOString().slice(0, 16);
    
    setToday(now.toISOString().split("T")[0]);
    setMinDateTime(tomorrowDateTime);
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare the data for the API call
    const contactData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.consultationType || 'General Consultation', // Use consultationType as subject
      message: formData.message || 'No additional details provided',
      preferred_date: formData.preferred_date || minDateTime
    };
  
    try {
      // Send the data to the contact endpoint
      const response = await apiService.contact.sendMessage(contactData);
      
      // Check for success based on the actual API response structure
      if (response.status === 'received' || response.message === 'Consultation request submitted successfully') {
        toast.success('Consultation request submitted successfully!');
        // Optionally reset the form
        setFormData({
          name: '',
          email: '',
          phone: '',
          consultationType: '',
          message: '',
          preferred_date: minDateTime, // Reset to tomorrow's date
        });
        // Optionally redirect or perform other actions
        // router.push('/thank-you'); // Uncomment and adjust if you have a thank-you page
      } else {
        toast.error(response.message || 'Failed to submit the request.');
      }
    } catch (error: any) {
      // console.error('API Error:', error);
      const errorMessage = error.message || 'An error occurred while submitting the request.';
      toast.error(errorMessage);
    }
  };

  const teamMembers = [
    {
      name: "Dr. Rajesh Sharma",
      title: "Founder & Chief Vastu Consultant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "With over 25 years of experience in traditional Vastu Shastra, Dr. Sharma has guided thousands of families and businesses toward prosperity and harmony through ancient Vedic principles.",
      expertise: ["Traditional Vastu", "Brahma Vastu", "Commercial Spaces", "Remedial Solutions"],
      experience: "25+ Years",
      clients: "5000+ Clients"
    },
    {
      name: "Priya Patel",
      title: "CEO & Modern Vastu Specialist",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&crop=face",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Priya brings a modern approach to ancient wisdom, specializing in contemporary architecture while maintaining traditional Vastu principles. She holds an MBA and is certified in Advanced Vastu consultation.",
      expertise: ["Modern Architecture", "Interior Design", "Corporate Vastu", "Feng Shui Integration"],
      experience: "15+ Years",
      clients: "3000+ Projects"
    }
  ];

  const consultants = [
    {
      name: "Amit Kumar",
      title: "Senior Vastu Consultant",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Specializes in residential Vastu and has helped over 2000 families create harmonious living spaces.",
      expertise: ["Residential Vastu", "Plot Selection", "Interior Planning"],
      experience: "12+ Years",
      clients: "2000+ Homes"
    },
    {
      name: "Sunita Joshi",
      title: "Vastu & Astrology Expert",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Combines Vastu Shastra with Vedic astrology to provide comprehensive life guidance and spatial harmony.",
      expertise: ["Vedic Astrology", "Muhurat Selection", "Gemstone Consultation"],
      experience: "18+ Years",
      clients: "2500+ Consultations"
    }
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: theme.palette.background.default }}
    >
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-100 via-yellow-50 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900" />
      <Navbar />
      <main
        className="flex-1 w-full max-w-7xl mx-auto rounded-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 box-border"
        style={{
          background: isDarkMode 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode
            ? '1px solid rgba(148, 163, 184, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: isDarkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: theme.palette.text.primary,
          minHeight: '80vh',
          marginTop: isMobile ? '2rem' : '3rem',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
        }}
      >
        {/* Modern Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-6 transition-all duration-300 hover:scale-105"
            style={{
              background: isDarkMode
                ? 'rgba(139, 92, 246, 0.1)'
                : 'rgba(139, 92, 246, 0.05)',
              border: isDarkMode
                ? '1px solid rgba(139, 92, 246, 0.2)'
                : '1px solid rgba(139, 92, 246, 0.1)',
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" style={{ color: '#8b5cf6' }} />
            <span className="text-sm font-medium" style={{ color: '#8b5cf6' }}>
              Expert Vastu Consultation
            </span>
          </div>
          
          <h1
            className="font-bold mb-6"
            style={{ 
              fontSize: sectionTitleSize,
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: isDarkMode 
                ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Connect with Brahma Vastu Experts
          </h1>
          
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: theme.palette.text.secondary }}>
            Transform your space with ancient Vedic wisdom. Our certified Vastu experts provide personalized consultations 
            to harmonize your environment and enhance prosperity.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(34, 197, 94, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.2)'
                  : '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <Users className="w-6 h-6" style={{ color: '#22c55e' }} />
              <div className="text-left">
                <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>10,000+</div>
                <div className="text-sm" style={{ color: theme.palette.text.secondary }}>Happy Clients</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(59, 130, 246, 0.2)'
                  : '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              <Award className="w-6 h-6" style={{ color: '#3b82f6' }} />
              <div className="text-left">
                <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>25+</div>
                <div className="text-sm" style={{ color: theme.palette.text.secondary }}>Years Experience</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: isDarkMode
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'rgba(139, 92, 246, 0.05)',
                border: isDarkMode
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
              }}
            >
              <Zap className="w-6 h-6" style={{ color: '#8b5cf6' }} />
              <div className="text-left">
                <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>98%</div>
                <div className="text-sm" style={{ color: theme.palette.text.secondary }}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <FadeInSection>
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <TeamMemberBox member={teamMembers[0]} imageOnRight={false} />
            <TeamMemberBox member={teamMembers[1]} imageOnRight={true} />
          </div>
        </FadeInSection>

        {/* Consultants Section */}
        <FadeInSection>
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Consultants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {consultants.map((consultant, index) => (
              <ConsultantBox 
                key={index} 
                member={consultant} 
                imageOnRight={index % 2 !== 0} // Alternates image position
              />
            ))}
          </div>
        </FadeInSection>

        {/* Contact Information and Services */}
        <FadeInSection>
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ 
              backgroundImage: isDarkMode
                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: isDarkMode
                  ? 'rgba(15, 23, 42, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: isDarkMode
                  ? '1px solid rgba(148, 163, 184, 0.1)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: isDarkMode
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ 
                  backgroundImage: isDarkMode
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: isDarkMode
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: isDarkMode
                      ? '1px solid rgba(59, 130, 246, 0.2)'
                      : '1px solid rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <div className="p-2 rounded-lg"
                    style={{
                      background: isDarkMode
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <Phone className="w-6 h-6" style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      +91 98765 43210
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      24/7 Consultation Helpline
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: isDarkMode
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: isDarkMode
                      ? '1px solid rgba(59, 130, 246, 0.2)'
                      : '1px solid rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <div className="p-2 rounded-lg"
                    style={{
                      background: isDarkMode
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <Mail className="w-6 h-6" style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      info@brahmavastu.com
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      Email Consultation Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: isDarkMode
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: isDarkMode
                      ? '1px solid rgba(59, 130, 246, 0.2)'
                      : '1px solid rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <div className="p-2 rounded-lg"
                    style={{
                      background: isDarkMode
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      Mumbai, Delhi, Bangalore
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      On-site Consultation Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: isDarkMode
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: isDarkMode
                      ? '1px solid rgba(59, 130, 246, 0.2)'
                      : '1px solid rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <div className="p-2 rounded-lg"
                    style={{
                      background: isDarkMode
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <Clock className="w-6 h-6" style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      Mon - Sat: 9 AM - 8 PM
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: isDarkMode
                  ? 'rgba(15, 23, 42, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: isDarkMode
                  ? '1px solid rgba(148, 163, 184, 0.1)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: isDarkMode
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ 
                  backgroundImage: isDarkMode
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Services
              </h3>
              <div className="space-y-3">
                {[
                  "Complete Vastu Analysis",
                  "New Construction Planning",
                  "Property Correction Solutions",
                  "Commercial Space Optimization",
                  "Plot Selection Guidance",
                  "Interior Design Consultation",
                  "Remedial Vastu Solutions",
                  "Online Video Consultations"
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: isDarkMode
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(34, 197, 94, 0.05)',
                      border: isDarkMode
                        ? '1px solid rgba(34, 197, 94, 0.2)'
                        : '1px solid rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: isDarkMode
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(34, 197, 94, 0.1)',
                      }}
                    >
                      <Star className="w-4 h-4" style={{ color: '#22c55e' }} />
                    </div>
                    <span style={{ color: theme.palette.text.primary }}>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Request Consultation Form */}
        <FadeInSection>
        <div
          className="max-w-4xl mx-auto p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
          style={{
            background: isDarkMode
              ? 'rgba(15, 23, 42, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              background: `radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, #22c55e 0%, transparent 50%)`
            }}
          />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full mb-4 transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  border: isDarkMode
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <Calendar className="w-4 h-4 mr-2" style={{ color: '#3b82f6' }} />
                <span className="text-sm font-medium" style={{ color: '#3b82f6' }}>
                  Book Your Consultation
                </span>
              </div>
              
              <h3
                className="text-3xl font-bold mb-4"
                style={{ 
                  backgroundImage: isDarkMode
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Request Consultation
              </h3>
              
              <p className="text-lg" style={{ color: theme.palette.text.secondary }}>
                Get personalized Vastu guidance from our certified experts
              </p>
            </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                  <Users className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                  style={{
                    borderColor: isDarkMode 
                      ? 'rgba(148, 163, 184, 0.2)' 
                      : 'rgba(148, 163, 184, 0.3)',
                    background: isDarkMode
                      ? 'rgba(15, 23, 42, 0.5)'
                      : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    color: theme.palette.text.primary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDarkMode 
                      ? 'rgba(148, 163, 184, 0.2)' 
                      : 'rgba(148, 163, 184, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                  style={{
                    borderColor: isDarkMode 
                      ? 'rgba(148, 163, 184, 0.2)' 
                      : 'rgba(148, 163, 184, 0.3)',
                    background: isDarkMode
                      ? 'rgba(15, 23, 42, 0.5)'
                      : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    color: theme.palette.text.primary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDarkMode 
                      ? 'rgba(148, 163, 184, 0.2)' 
                      : 'rgba(148, 163, 184, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Preferred Date & Time
                  </label>
                  {mounted ? (
                    <input
                      type="datetime-local"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      min={minDateTime}
                      className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                      style={{
                        borderColor: isDarkMode 
                          ? 'rgba(148, 163, 184, 0.2)' 
                          : 'rgba(148, 163, 184, 0.3)',
                        background: isDarkMode
                          ? 'rgba(15, 23, 42, 0.5)'
                          : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        color: theme.palette.text.primary,
                        colorScheme: isDarkMode ? 'dark' : 'light',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isDarkMode 
                          ? 'rgba(148, 163, 184, 0.2)' 
                          : 'rgba(148, 163, 184, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Loading date picker..."
                      value={formData.preferred_date}
                      disabled
                      className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                      style={{
                        borderColor: isDarkMode 
                          ? 'rgba(148, 163, 184, 0.2)' 
                          : 'rgba(148, 163, 184, 0.3)',
                        background: isDarkMode
                          ? 'rgba(15, 23, 42, 0.5)'
                          : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        color: theme.palette.text.primary,
                        opacity: 0.6,
                      }}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                    style={{
                      borderColor: isDarkMode 
                        ? 'rgba(148, 163, 184, 0.2)' 
                        : 'rgba(148, 163, 184, 0.3)',
                      background: isDarkMode
                        ? 'rgba(15, 23, 42, 0.5)'
                        : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      color: theme.palette.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode 
                        ? 'rgba(148, 163, 184, 0.2)' 
                        : 'rgba(148, 163, 184, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                <Award className="w-4 h-4 mr-2" />
                Consultation Type
              </label>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105 appearance-none cursor-pointer"
                style={{
                  borderColor: isDarkMode 
                    ? 'rgba(148, 163, 184, 0.2)' 
                    : 'rgba(148, 163, 184, 0.3)',
                  backgroundColor: isDarkMode
                    ? 'rgba(15, 23, 42, 0.5)'
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  color: theme.palette.text.primary,
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px',
                  paddingRight: '40px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  e.target.style.backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode 
                    ? 'rgba(148, 163, 184, 0.2)' 
                    : 'rgba(148, 163, 184, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`;
                }}
              >
                <option value="" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.secondary 
                }}>
                  Select Consultation Type
                </option>
                <option value="Residential Vastu" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.primary 
                }}>
                  🏡 Residential Vastu
                </option>
                <option value="Commercial Vastu" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.primary 
                }}>
                  🏢 Commercial Vastu
                </option>
                <option value="Plot Selection" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.primary 
                }}>
                  📍 Plot Selection
                </option>
                <option value="Remedial Solutions" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.primary 
                }}>
                  🔧 Remedial Solutions
                </option>
                <option value="Online Consultation" style={{ 
                  background: isDarkMode ? '#1e293b' : '#f8fafc',
                  color: theme.palette.text.primary 
                }}>
                  💻 Online Consultation
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center" style={{ color: theme.palette.text.primary }}>
                <Star className="w-4 h-4 mr-2" />
                Additional Requirements
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your requirements and what you hope to achieve..."
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-105 resize-none"
                style={{
                  borderColor: isDarkMode 
                    ? 'rgba(148, 163, 184, 0.2)' 
                    : 'rgba(148, 163, 184, 0.3)',
                  background: isDarkMode
                    ? 'rgba(15, 23, 42, 0.5)'
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  color: theme.palette.text.primary,
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode 
                    ? 'rgba(148, 163, 184, 0.2)' 
                    : 'rgba(148, 163, 184, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              <div className="flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span>Book Your Consultation</span>
                <Sparkles className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>
            
            {/* Modern Helper Text */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(34, 197, 94, 0.05)',
                  border: isDarkMode
                    ? '1px solid rgba(34, 197, 94, 0.2)'
                    : '1px solid rgba(34, 197, 94, 0.1)',
                }}
              >
                <Zap className="w-4 h-4" style={{ color: '#22c55e' }} />
                <span className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                  Quick Response
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  border: isDarkMode
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <Shield className="w-4 h-4" style={{ color: '#3b82f6' }} />
                <span className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                  Secure & Private
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isDarkMode
                    ? 'rgba(139, 92, 246, 0.1)'
                    : 'rgba(139, 92, 246, 0.05)',
                  border: isDarkMode
                    ? '1px solid rgba(139, 92, 246, 0.2)'
                    : '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <Award className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                <span className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                  Expert Guidance
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm" style={{ 
                color: theme.palette.text.secondary,
                opacity: 0.8 
              }}>
                We'll get back to you within 24 hours • Your information is secure and will never be shared
              </p>
            </div>
          </div>
         </div>
         </div>
       </FadeInSection>
       </main>
      <Footer />
     </div>
   );
 }


