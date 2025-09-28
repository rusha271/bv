'use client';

import React from 'react';
import { X, Phone, Mail, MapPin, Clock, Award, Users } from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Enhanced Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all duration-500 transform scale-100 opacity-100 translate-y-0"
        style={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(25px)',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(34, 197, 94, 0.1)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34, 197, 94, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(34, 197, 94, 0.05)',
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
              ? 'rgba(34, 197, 94, 0.2)'
              : 'rgba(34, 197, 94, 0.1)',
          }}
        >
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(34, 197, 94, 0.2)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(34, 197, 94, 0.2)'
                  : '0 8px 32px rgba(34, 197, 94, 0.1)',
              }}
            >
              <Users className="w-7 h-7" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Contact Us
              </h2>
              <p className="text-sm opacity-80" style={{ color: theme.palette.text.secondary }}>
                Get in touch with our Vastu experts
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
        <div className="p-6">
          <div className="space-y-6">
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Phone */}
              <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <Phone className="w-5 h-5" style={{ color: '#3b82f6' }} />
                  </div>
                  <h4 className="font-bold" style={{ color: theme.palette.text.primary }}>
                    Phone
                  </h4>
                </div>
                <p className="text-lg font-semibold mb-1" style={{ color: '#3b82f6' }}>
                  +91 98765 43210
                </p>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                  Call us for immediate assistance
                </p>
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(34, 197, 94, 0.2)'
                    : '1px solid rgba(34, 197, 94, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <Mail className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <h4 className="font-bold" style={{ color: theme.palette.text.primary }}>
                    Email
                  </h4>
                </div>
                <p className="text-lg font-semibold mb-1" style={{ color: '#22c55e' }}>
                  info@brahmavastu.com
                </p>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                  Email us for detailed inquiries
                </p>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(139, 92, 246, 0.2)'
                    : '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(139, 92, 246, 0.2)'
                        : 'rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  </div>
                  <h4 className="font-bold" style={{ color: theme.palette.text.primary }}>
                    Location
                  </h4>
                </div>
                <p className="text-lg font-semibold mb-1" style={{ color: '#8b5cf6' }}>
                  Mumbai, Delhi, Bangalore
                </p>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                  On-site consultations available
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.02) 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(245, 158, 11, 0.2)'
                  : '1px solid rgba(245, 158, 11, 0.1)',
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(245, 158, 11, 0.1)',
                  }}
                >
                  <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>
                  Business Hours
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(245, 158, 11, 0.05)'
                      : 'rgba(245, 158, 11, 0.02)',
                  }}
                >
                  <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.palette.text.primary }}>
                      Mon - Sat: 9 AM - 8 PM
                    </p>
                    <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                      Regular business hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(245, 158, 11, 0.05)'
                      : 'rgba(245, 158, 11, 0.02)',
                  }}
                >
                  <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.palette.text.primary }}>
                      Sunday: By appointment only
                    </p>
                    <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                      Special arrangements available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(34, 197, 94, 0.2)'
                    : '1px solid rgba(34, 197, 94, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <Users className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <h4 className="font-bold" style={{ color: theme.palette.text.primary }}>
                    Happy Clients
                  </h4>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>
                  10K+
                </div>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                  Satisfied customers worldwide
                </p>
              </div>

              <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
                style={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(59, 130, 246, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.1)',
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-xl"
                    style={{
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }}
                  >
                    <Award className="w-5 h-5" style={{ color: '#3b82f6' }} />
                  </div>
                  <h4 className="font-bold" style={{ color: theme.palette.text.primary }}>
                    Years Experience
                  </h4>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: '#3b82f6' }}>
                  25+
                </div>
                <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                  Professional expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;