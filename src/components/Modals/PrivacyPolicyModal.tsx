'use client';

import React, { useEffect, useState } from 'react';
import { X, Shield, Eye, Lock, Database, UserCheck, Globe, FileText, Sparkles, Zap, Star, AlertTriangle, MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, theme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-60' : 'bg-opacity-0'
        } backdrop-blur-md`}
        onClick={onClose}
      />
      
      {/* Enhanced Modal */}
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all duration-500 transform ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(25px)',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(59, 130, 246, 0.1)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.05)',
        }}
      >
        {/* Enhanced Header */}
        <div className="sticky top-0 p-6 border-b flex items-center justify-between relative overflow-hidden"
          style={{
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(25px)',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(59, 130, 246, 0.2)' 
              : 'rgba(59, 130, 246, 0.1)',
          }}
        >
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: `radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, #22c55e 0%, transparent 50%)`
            }}
          />
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(59, 130, 246, 0.2)'
                  : '0 8px 32px rgba(59, 130, 246, 0.1)',
              }}
            >
              <Shield className="w-7 h-7" style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1" 
                style={{ 
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Privacy Policy
              </h2>
              <p className="text-sm opacity-80" style={{ color: theme.palette.text.secondary }}>
                Your data protection and privacy rights
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 group relative overflow-hidden"
            style={{
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(239, 68, 68, 0.2)'
                : '1px solid rgba(239, 68, 68, 0.1)',
            }}
          >
            <X className="w-6 h-6 transition-colors duration-300 group-hover:text-white" style={{ color: '#ef4444' }} />
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="p-8 space-y-8">
          {/* Introduction */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <FileText className="w-6 h-6" style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Introduction
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  }}
                />
              </div>
            </div>
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.01) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(59, 130, 246, 0.1)'
                  : '1px solid rgba(59, 130, 246, 0.05)',
              }}
            >
              <p className="leading-relaxed text-lg" style={{ color: theme.palette.text.secondary }}>
                At <span className="font-semibold" style={{ color: '#3b82f6' }}>Brahma Vastu</span>, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <Database className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Information We Collect
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <UserCheck className="w-5 h-5" style={{ color: '#3b82f6' }} />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                    Personal Information
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Name, email address, and phone number',
                    'Consultation preferences and requirements',
                    'Property details and Vastu analysis requests',
                    'Payment information (processed securely)'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: '#3b82f6' }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(16, 185, 129, 0.2)'
                    : '1px solid rgba(16, 185, 129, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(16, 185, 129, 0.1)',
                    }}
                  >
                    <Zap className="w-5 h-5" style={{ color: '#10b981' }} />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                    Technical Information
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'IP address and device information',
                    'Browser type and version',
                    'Website usage patterns and preferences',
                    'Cookies and similar tracking technologies'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: '#10b981' }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(139, 92, 246, 0.3)'
                    : '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <Eye className="w-6 h-6" style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  How We Use Your Information
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Service Delivery",
                  icon: Star,
                  color: "#3b82f6",
                  items: ["Providing Vastu consultations", "Scheduling appointments", "Sending consultation reports"]
                },
                {
                  title: "Communication",
                  icon: require("lucide-react").MessageCircle,
                  color: "#10b981",
                  items: ["Responding to inquiries", "Sending updates", "Marketing communications (with consent)"]
                },
                {
                  title: "Improvement",
                  icon: Sparkles,
                  color: "#f59e0b",
                  items: ["Analyzing service usage", "Enhancing user experience", "Developing new features"]
                },
                {
                  title: "Legal Compliance",
                  icon: Shield,
                  color: "#ef4444",
                  items: ["Meeting legal obligations", "Protecting our rights", "Preventing fraud"]
                }
              ].map((section, index) => (
                <div key={index} className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${section.color}15 0%, ${section.color}05 100%)`
                      : `linear-gradient(135deg, ${section.color}08 0%, ${section.color}02 100%)`,
                    border: theme.palette.mode === 'dark'
                      ? `1px solid ${section.color}20`
                      : `1px solid ${section.color}10`,
                  }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-xl"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? `${section.color}20`
                          : `${section.color}10`,
                      }}
                    >
                      <section.icon className="w-5 h-5" style={{ color: section.color }} />
                    </div>
                    <h4 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ background: section.color }}
                        />
                        <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Data Security */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <Lock className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
                      : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Data Security
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
                      : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(239, 68, 68, 0.2)'
                  : '1px solid rgba(239, 68, 68, 0.1)',
              }}
            >
              <p className="leading-relaxed mb-6 text-lg" style={{ color: theme.palette.text.secondary }}>
                We implement <span className="font-semibold" style={{ color: '#ef4444' }}>industry-standard security measures</span> to protect your personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "SSL encryption for data transmission", icon: Shield },
                  { text: "Secure servers with regular security updates", icon: Database },
                  { text: "Limited access to personal data on a need-to-know basis", icon: UserCheck },
                  { text: "Regular security audits and monitoring", icon: Eye },
                  { text: "Secure payment processing through trusted third parties", icon: Lock }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'rgba(239, 68, 68, 0.02)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(239, 68, 68, 0.1)',
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: '#ef4444' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <UserCheck className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Your Rights
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { text: "Access your personal data", icon: Eye },
                { text: "Correct inaccurate information", icon: FileText },
                { text: "Delete your data", icon: X },
                { text: "Restrict data processing", icon: Shield },
                { text: "Data portability", icon: Database },
                { text: "Withdraw consent", icon: UserCheck },
                { text: "Object to processing", icon: AlertTriangle },
                { text: "Lodge complaints", icon: MessageCircle }
              ].map((right, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(34, 197, 94, 0.2)'
                      : '1px solid rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <div className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <right.icon className="w-4 h-4" style={{ color: '#22c55e' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                    {right.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Globe className="w-6 h-6" style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Contact Us
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(59, 130, 246, 0.2)'
                  : '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              <p className="leading-relaxed mb-6 text-lg" style={{ color: theme.palette.text.secondary }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Email", value: "privacy@brahmavastu.com", icon: Mail },
                  { label: "Phone", value: "+91 98765 43210", icon: Phone },
                  { label: "Address", value: "Mumbai, Delhi, Bangalore", icon: MapPin }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.05)'
                        : 'rgba(59, 130, 246, 0.02)',
                    }}
                  >
                    <div className="p-2 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(59, 130, 246, 0.1)',
                      }}
                    >
                      <contact.icon className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.palette.text.secondary }}>
                        {contact.label}
                      </p>
                      <p className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                        {contact.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center pt-6 border-t"
            style={{ borderColor: theme.palette.divider }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'rgba(148, 163, 184, 0.1)'
                  : 'rgba(148, 163, 184, 0.05)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(148, 163, 184, 0.2)'
                  : '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <Clock className="w-4 h-4" style={{ color: theme.palette.text.secondary }} />
              <p className="text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
