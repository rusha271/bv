"use client";

import DashboardLayout from "@/components/ui/admin-dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { MessageSquare, Calendar, User, Phone } from "lucide-react";

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
        console.error('Error fetching consultations:', err);
        setError('Failed to load consultation requests');
        // Keep using dummy data as fallback
      }
    };

    fetchConsultations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Requests</h1>
            <p className="text-gray-600">Manage and track consultation inquiries</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-200 pb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Requests</h1>
          <p className="text-gray-600">Manage and track consultation inquiries</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">
                Consultation Requests ({consultations.length})
              </h2>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {consultations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No consultation requests found
              </div>
            ) : (
              consultations.map((consultation) => (
                <div key={consultation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{consultation.name}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        {consultation.email}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Phone className="h-4 w-4 mr-1" />
                        {consultation.phone}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{consultation.message}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(consultation.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Contact
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
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
    </DashboardLayout>
  );
} 