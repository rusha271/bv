'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Box from '@mui/material/Box';
import { Phone, Mail, MapPin, Clock, Star, Calendar, Play, X } from 'lucide-react';
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
  const { theme } = useThemeContext();
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
      className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500"
      style={{
        background: theme.palette.background.paper,
        border: `2px solid ${theme.palette.divider}`,
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
            style={{ color: theme.palette.primary.main }}
          >
            {member.name}
          </h3>
          <p
            className="font-semibold mb-3"
            style={{ color: theme.palette.secondary.main }}
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
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" style={{ color: theme.palette.primary.main }} />
              <span style={{ color: theme.palette.text.secondary }}>
                {member.experience}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" style={{ color: theme.palette.primary.main }} />
              <span style={{ color: theme.palette.text.secondary }}>
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
  const { theme } = useThemeContext();
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
      className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500"
      style={{
        background: theme.palette.background.paper,
        border: `2px solid ${theme.palette.divider}`,
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
            style={{ color: theme.palette.primary.main }}
          >
            {member.name}
          </h3>
          <p
            className="font-semibold mb-3"
            style={{ color: theme.palette.secondary.main }}
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
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" style={{ color: theme.palette.primary.main }} />
              <span style={{ color: theme.palette.text.secondary }}>
                {member.experience}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" style={{ color: theme.palette.primary.main }} />
              <span style={{ color: theme.palette.text.secondary }}>
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
  const { theme } = useThemeContext();
  const { isMobile, isTablet } = useDeviceType();
  const sectionTitleSize = isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem';
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [minDateTime, setMinDateTime] = useState('');
  
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
      if (response.success) {
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
      console.error('API Error:', error);
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
        className="flex-1 w-full max-w-7xl mx-auto rounded-xl shadow-md px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 box-border"
        style={{
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          minHeight: '80vh',
          marginTop: isMobile ? '2rem' : '3rem',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
        }}
      >
        <h1
          className="font-bold mb-8 text-center"
          style={{ color: theme.palette.primary.main, fontSize: sectionTitleSize }}
        >
          Connect with Brahma Vastu Experts
        </h1>

        {/* Leadership Section */}
        <FadeInSection>
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: theme.palette.primary.main }}
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
            style={{ color: theme.palette.primary.main }}
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
            style={{ color: theme.palette.primary.main }}
          >
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className="p-6 rounded-2xl shadow-lg"
              style={{
                background: theme.palette.background.paper,
                border: `2px solid ${theme.palette.divider}`
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: theme.palette.primary.main }}
              >
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-all duration-200">
                  <Phone className="w-6 h-6" style={{ color: theme.palette.primary.main }} />
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      +91 98765 43210
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      24/7 Consultation Helpline
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-all duration-200">
                  <Mail className="w-6 h-6" style={{ color: theme.palette.primary.main }} />
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      info@brahmavastu.com
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      Email Consultation Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-all duration-200">
                  <MapPin className="w-6 h-6" style={{ color: theme.palette.primary.main }} />
                  <div>
                    <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                      Mumbai, Delhi, Bangalore
                    </p>
                    <p className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      On-site Consultation Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-all duration-200">
                  <Clock className="w-6 h-6" style={{ color: theme.palette.primary.main }} />
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
              className="p-6 rounded-2xl shadow-lg"
              style={{
                background: theme.palette.background.paper,
                border: `2px solid ${theme.palette.divider}`
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: theme.palette.primary.main }}
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
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-10 hover:bg-green-500 transition-all duration-200"
                  >
                    <Star className="w-4 h-4" style={{ color: theme.palette.secondary.main }} />
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
          className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg"
          style={{
            background: theme.palette.background.paper,
            border: `2px solid ${theme.palette.divider}`,
          }}
        >
          <h3
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: theme.palette.primary.main }}
          >
            Request Consultation
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                style={{
                  borderColor: theme.palette.divider,
                  background: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                style={{
                  borderColor: theme.palette.divider,
                  background: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mounted ? (
                <input
                  type="datetime-local"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleInputChange}
                  min={minDateTime}
                  className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                  style={{
                    borderColor: theme.palette.divider,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light',
                  }}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Loading date picker..."
                  disabled
                  className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                  style={{
                    borderColor: theme.palette.divider,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    opacity: 0.6,
                  }}
                />
              )}
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                  style={{
                    borderColor: theme.palette.divider,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                  }}
                />
              </div>
            </div>
            <select
              name="consultationType"
              value={formData.consultationType}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none"
              style={{
                borderColor: theme.palette.divider,
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            >
              <option value="">Select Consultation Type</option>
              <option value="Residential Vastu">Residential Vastu</option>
              <option value="Commercial Vastu">Commercial Vastu</option>
              <option value="Plot Selection">Plot Selection</option>
              <option value="Remedial Solutions">Remedial Solutions</option>
              <option value="Online Consultation">Online Consultation</option>
            </select>
            <textarea
              name="message"
              placeholder="Tell us about your requirements..."
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 rounded-lg border-2 transition-all duration-200 focus:border-blue-500 focus:outline-none resize-none"
              style={{
                borderColor: theme.palette.divider,
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
            <button
              onClick={handleSubmit}
              className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <Calendar className="w-5 h-5 inline-block mr-2" />
              Book Consultation
            </button>
          </div>
        </div>
      </FadeInSection>
      </main>
      <Footer />
    </div>
  );
}


