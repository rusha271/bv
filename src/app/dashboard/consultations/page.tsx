"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { MessageSquare, Calendar, User, Phone, Clock, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useGlobalTheme } from "@/contexts/GlobalThemeContext";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'pending' | 'contacted' | 'completed';
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode, isDarkMode, isLightMode } = useGlobalTheme();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/contact/consultation/simple');
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our interface
          const transformedData = Array.isArray(data) ? data : [];
          setConsultations(transformedData);
        } else {
          // Fallback to dummy data
          setConsultations([
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1-555-0123',
              message: 'Interested in Vastu consultation for my new home',
              date: '2024-01-15',
              status: 'pending'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+1-555-0456',
              message: 'Need consultation for office space optimization',
              date: '2024-01-14',
              status: 'contacted'
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike@example.com',
              phone: '+1-555-0789',
              message: 'Looking for residential Vastu services',
              date: '2024-01-13',
              status: 'completed'
            }
          ]);
        }
      } catch (err) {
        // console.error('Error fetching consultations:', err);
        setError('Failed to load consultation requests');
        // Keep using dummy data as fallback
      }
    };

    fetchConsultations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return mode === 'dark' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return mode === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return mode === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return mode === 'dark' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'contacted': return <MessageSquare className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen transition-all duration-300 ${
          mode === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        }`}>
          <div className="container mx-auto px-6 py-8">
            <div className="text-center lg:text-left mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 mb-6 shadow-lg lg:hidden">
                <MessageSquare className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
                mode === 'dark' 
                  ? 'from-white via-emerald-200 to-purple-200' 
                  : 'from-gray-900 via-emerald-800 to-purple-800'
              } bg-clip-text text-transparent mb-4`}>
                Consultation Requests
              </h1>
              <p className={`text-xl ${
                mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
                Manage and track consultation inquiries
              </p>
          </div>
            <div className={`rounded-2xl backdrop-blur-xl border shadow-xl p-8 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            }`}>
              <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                  <div key={i} className={`border-b pb-6 ${
                    mode === 'dark' ? 'border-slate-700' : 'border-gray-200'
                  }`}>
                    <div className={`h-4 rounded w-1/4 mb-3 ${
                      mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded w-1/3 mb-2 ${
                      mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded w-1/2 ${
                      mode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`}></div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen transition-all duration-300 ${
        mode === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
        <div className="container mx-auto px-6 py-8">
          {/* Modern Header Section */}
          <div className="text-center lg:text-left mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 mb-6 shadow-lg lg:hidden">
              <MessageSquare className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              mode === 'dark' 
                ? 'from-white via-emerald-200 to-purple-200' 
                : 'from-gray-900 via-emerald-800 to-purple-800'
            } bg-clip-text text-transparent mb-4`}>
              Consultation Requests
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto lg:mx-0 leading-relaxed`}>
              Manage and track consultation inquiries with comprehensive tools
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
        <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Requests</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{consultations.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
        </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Pending</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{consultations.filter(c => c.status === 'pending').length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
          </div>

            <div className={`rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
              mode === 'dark' 
                ? 'bg-slate-800/80 border-slate-700/50' 
                : 'bg-white/80 border-slate-200/50'
            } shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completed</p>
                  <p className={`text-3xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{consultations.filter(c => c.status === 'completed').length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className={`rounded-2xl backdrop-blur-xl border shadow-xl p-6 mb-8 ${
              mode === 'dark' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className={`text-sm ${
                  mode === 'dark' ? 'text-red-300' : 'text-red-600'
                }`}>{error}</p>
              </div>
            </div>
          )}

          <div className={`rounded-2xl backdrop-blur-xl border shadow-xl ${
            mode === 'dark' 
              ? 'bg-slate-800/80 border-slate-700/50' 
              : 'bg-white/80 border-slate-200/50'
          }`}>
            <div className={`p-8 border-b ${
              mode === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Consultation Requests
                  </h2>
                  <p className={`text-sm ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {consultations.length} total requests
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`divide-y ${
              mode === 'dark' ? 'divide-slate-700' : 'divide-gray-200'
            }`}>
              {consultations.length === 0 ? (
                <div className={`p-12 text-center ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No consultation requests found</p>
                  <p className="text-sm">New requests will appear here when submitted</p>
              </div>
            ) : (
              consultations.map((consultation) => (
                  <div key={consultation.id} className="p-8 hover:bg-opacity-50 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <h3 className={`text-xl font-bold ${
                            mode === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{consultation.name}</h3>
                          <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-2 ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                          {consultation.status}
                        </span>
                      </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className={`flex items-center text-sm ${
                            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <User className="h-4 w-4 mr-2 text-emerald-500" />
                        {consultation.email}
                      </div>
                      
                          <div className={`flex items-center text-sm ${
                            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <Phone className="h-4 w-4 mr-2 text-emerald-500" />
                        {consultation.phone}
                          </div>
                      </div>
                      
                        <p className={`mb-4 leading-relaxed ${
                          mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>{consultation.message}</p>
                        
                        <div className={`flex items-center text-sm ${
                          mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                        {new Date(consultation.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                      <div className="ml-8 flex flex-col space-y-3">
                        <button className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg">
                        Contact
                      </button>
                        <button className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                          mode === 'dark' 
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 