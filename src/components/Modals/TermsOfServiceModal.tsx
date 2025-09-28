'use client';

import React, { useEffect, useState } from 'react';
import { X, FileText, Scale, AlertTriangle, CheckCircle, Clock, Shield, Users, Sparkles, Zap, Star, MapPin, Mail, Phone } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose, theme }) => {
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
            ? 'rgba(139, 92, 246, 0.2)' 
            : 'rgba(139, 92, 246, 0.1)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(139, 92, 246, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.05)',
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
              ? 'rgba(139, 92, 246, 0.2)' 
              : 'rgba(139, 92, 246, 0.1)',
          }}
        >
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: `radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, #22c55e 0%, transparent 50%)`
            }}
          />
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(139, 92, 246, 0.3)'
                  : '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(139, 92, 246, 0.2)'
                  : '0 8px 32px rgba(139, 92, 246, 0.1)',
              }}
            >
              <Scale className="w-7 h-7" style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1" 
                style={{ 
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)'
                    : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Terms of Service
              </h2>
              <p className="text-sm opacity-80" style={{ color: theme.palette.text.secondary }}>
                Legal terms and conditions for our services
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
                  Agreement to Terms
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
                By accessing and using <span className="font-semibold" style={{ color: '#3b82f6' }}>Brahma Vastu</span> services, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, you may not access our services.
              </p>
            </div>
          </div>

          {/* Service Description */}
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
                <Users className="w-6 h-6" style={{ color: '#10b981' }} />
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
                  Our Services
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
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(16, 185, 129, 0.2)'
                  : '1px solid rgba(16, 185, 129, 0.1)',
              }}
            >
              <p className="leading-relaxed mb-6 text-lg" style={{ color: theme.palette.text.secondary }}>
                <span className="font-semibold" style={{ color: '#10b981' }}>Brahma Vastu</span> provides comprehensive Vastu Shastra consultation services including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "Residential and commercial Vastu analysis", icon: Star },
                  { text: "Plot selection and property evaluation", icon: MapPin },
                  { text: "Remedial solutions and recommendations", icon: Shield },
                  { text: "Online and on-site consultations", icon: Users },
                  { text: "Vastu-compliant design guidance", icon: FileText },
                  { text: "Follow-up support and guidance", icon: Clock }
                ].map((service, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(16, 185, 129, 0.05)'
                        : 'rgba(16, 185, 129, 0.02)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(16, 185, 129, 0.1)',
                      }}
                    >
                      <service.icon className="w-4 h-4" style={{ color: '#10b981' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {service.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
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
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
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
                  User Responsibilities
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Accurate Information",
                  icon: FileText,
                  color: "#3b82f6",
                  items: ["Provide truthful personal details", "Update contact information", "Share accurate property details"]
                },
                {
                  title: "Respectful Communication",
                  icon: Users,
                  color: "#10b981",
                  items: ["Maintain professional conduct", "Follow consultation guidelines", "Respect our team members"]
                },
                {
                  title: "Payment Obligations",
                  icon: Star,
                  color: "#f59e0b",
                  items: ["Pay fees on time", "Understand pricing structure", "Report payment issues promptly"]
                },
                {
                  title: "Compliance",
                  icon: Shield,
                  color: "#ef4444",
                  items: ["Follow local laws", "Respect intellectual property", "Use services appropriately"]
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

          {/* Payment Terms */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <Clock className="w-6 h-6" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                      : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Payment Terms
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                      : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(245, 158, 11, 0.2)'
                  : '1px solid rgba(245, 158, 11, 0.1)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "Consultation fees are due before or at the time of service", icon: Clock },
                  { text: "We accept various payment methods including cards, UPI, and bank transfers", icon: Star },
                  { text: "Refunds are processed within 5-7 business days for eligible cases", icon: CheckCircle },
                  { text: "Late payment fees may apply for overdue accounts", icon: AlertTriangle },
                  { text: "All prices are in Indian Rupees unless otherwise specified", icon: FileText },
                  { text: "We reserve the right to change pricing with 30 days notice", icon: Shield }
                ].map((term, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(245, 158, 11, 0.05)'
                        : 'rgba(245, 158, 11, 0.02)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(245, 158, 11, 0.1)',
                      }}
                    >
                      <term.icon className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {term.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
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
                <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
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
                  Cancellation & Refund Policy
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(239, 68, 68, 0.2)'
                    : '1px solid rgba(239, 68, 68, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(239, 68, 68, 0.1)',
                    }}
                  >
                    <X className="w-5 h-5" style={{ color: '#ef4444' }} />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                    Cancellation
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: "24+ hours: Full refund", color: "#22c55e" },
                    { text: "12-24 hours: 50% refund", color: "#f59e0b" },
                    { text: "Less than 12 hours: No refund", color: "#ef4444" },
                    { text: "Emergency cancellations: Case by case", color: "#3b82f6" }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(34, 197, 94, 0.2)'
                    : '1px solid rgba(34, 197, 94, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                    Refunds
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: "Processed within 5-7 business days", color: "#22c55e" },
                    { text: "Original payment method", color: "#3b82f6" },
                    { text: "Service quality issues: Full refund", color: "#10b981" },
                    { text: "No refunds for completed services", color: "#f59e0b" }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <Shield className="w-6 h-6" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" 
                  style={{ 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)'
                      : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Limitation of Liability
                </h3>
                <div className="w-16 h-1 rounded-full"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
                      : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(99, 102, 241, 0.2)'
                  : '1px solid rgba(99, 102, 241, 0.1)',
              }}
            >
              <p className="leading-relaxed mb-6 text-lg" style={{ color: theme.palette.text.secondary }}>
                Our Vastu consultations are based on <span className="font-semibold" style={{ color: '#6366f1' }}>traditional principles</span> and are provided for guidance purposes. 
                We do not guarantee specific outcomes and are not responsible for:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "Individual interpretation of recommendations", icon: Users },
                  { text: "Results from implementing suggestions", icon: Star },
                  { text: "Third-party actions or decisions", icon: AlertTriangle },
                  { text: "Force majeure events", icon: Shield },
                  { text: "Indirect or consequential damages", icon: FileText }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.05)'
                        : 'rgba(99, 102, 241, 0.02)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(99, 102, 241, 0.2)'
                          : 'rgba(99, 102, 241, 0.1)',
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: '#6366f1' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
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
                <FileText className="w-6 h-6" style={{ color: '#8b5cf6' }} />
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
                  Intellectual Property
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
            
            <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "All consultation reports and recommendations are proprietary", icon: Shield },
                  { text: "Clients may use recommendations for personal property only", icon: Users },
                  { text: "Commercial use requires written permission", icon: FileText },
                  { text: "We retain rights to our methodologies and processes", icon: Star },
                  { text: "Unauthorized distribution is prohibited", icon: AlertTriangle }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(139, 92, 246, 0.05)'
                        : 'rgba(139, 92, 246, 0.02)',
                    }}
                  >
                    <div className="p-1 rounded-lg"
                      style={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: theme.palette.text.secondary }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
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
                <Users className="w-6 h-6" style={{ color: '#3b82f6' }} />
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
                  Contact Information
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
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Email", value: "legal@brahmavastu.com", icon: Mail },
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

export default TermsOfServiceModal;
