'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, Grid, Card, CardContent, Divider, Alert, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import { Download, Payment, Receipt, History, CreditCard, GetApp, Visibility, CheckCircle, Pending, Error } from '@mui/icons-material';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useAuthUser } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  created_at: string;
  payment_method: string;
  transaction_id: string;
}

interface PDFDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_size: number;
  created_at: string;
  type: 'vastu_analysis' | 'floor_plan' | 'report' | 'certificate';
}

export default function PaymentsPage() {
  const { mode } = useThemeContext();
  const user = useAuthUser();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin and redirect if so
  useEffect(() => {
    if (user && user.role?.name === 'admin') {
      router.push('/dashboard');
      toast.error('Access denied. This page is only for regular users.');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API calls - replace with actual API endpoints
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API calls
        setPayments([
          {
            id: '1',
            amount: 99.99,
            currency: 'USD',
            status: 'completed',
            description: 'Premium Vastu Analysis Package',
            created_at: '2024-01-15T10:30:00Z',
            payment_method: 'Credit Card',
            transaction_id: 'TXN_123456789'
          },
          {
            id: '2',
            amount: 49.99,
            currency: 'USD',
            status: 'completed',
            description: 'Basic Floor Plan Analysis',
            created_at: '2024-01-10T14:20:00Z',
            payment_method: 'PayPal',
            transaction_id: 'TXN_987654321'
          },
          {
            id: '3',
            amount: 199.99,
            currency: 'USD',
            status: 'pending',
            description: 'Complete Vastu Consultation',
            created_at: '2024-01-20T09:15:00Z',
            payment_method: 'Bank Transfer',
            transaction_id: 'TXN_456789123'
          }
        ]);

        setPdfs([
          {
            id: '1',
            title: 'Vastu Analysis Report - Property 123',
            description: 'Complete Vastu analysis for your residential property',
            file_url: '/api/downloads/vastu-report-123.pdf',
            file_size: 2048576, // 2MB
            created_at: '2024-01-15T10:30:00Z',
            type: 'vastu_analysis'
          },
          {
            id: '2',
            title: 'Floor Plan Analysis - Main House',
            description: 'Detailed floor plan analysis with recommendations',
            file_url: '/api/downloads/floor-plan-analysis.pdf',
            file_size: 1536000, // 1.5MB
            created_at: '2024-01-10T14:20:00Z',
            type: 'floor_plan'
          },
          {
            id: '3',
            title: 'Vastu Certificate - Property 123',
            description: 'Official Vastu compliance certificate',
            file_url: '/api/downloads/vastu-certificate.pdf',
            file_size: 512000, // 512KB
            created_at: '2024-01-15T11:00:00Z',
            type: 'certificate'
          }
        ]);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Failed to load payment and document data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Pending color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vastu_analysis':
        return 'primary';
      case 'floor_plan':
        return 'secondary';
      case 'report':
        return 'info';
      case 'certificate':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (pdf: PDFDocument) => {
    try {
      // Simulate download - replace with actual download logic
      toast.success(`Downloading ${pdf.title}...`);
      
      // In a real implementation, you would:
      // 1. Call your API to get the download URL
      // 2. Create a temporary link and trigger download
      // 3. Track download analytics
      
      console.log('Downloading PDF:', pdf);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleViewPayment = (payment: PaymentRecord) => {
    // Simulate viewing payment details
    toast(`Viewing payment details for ${payment.transaction_id}`, {
      icon: 'ℹ️',
    });
    console.log('Payment details:', payment);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Navbar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            mt: { xs: 8, sm: 10 },
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your payments and documents...
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          mt: { xs: 8, sm: 10 },
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: mode === 'dark' ? 'white' : 'text.primary',
            }}
          >
            Payments & Documents
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Manage your payments and download your Vastu analysis documents
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Payment History */}
          <Box sx={{ flex: { xs: '1', lg: '0 0 60%' } }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Payment sx={{ fontSize: '1.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Payment History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your subscription and service payments
                  </Typography>
                </Box>
              </Box>

              {payments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Receipt sx={{ fontSize: 40, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No payments found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                    Your payment history will appear here once you make a purchase.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {payments.map((payment) => (
                    <Card
                      key={payment.id}
                      variant="outlined"
                      sx={{
                        background: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                              {payment.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {formatDate(payment.created_at)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                label={payment.payment_method}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                              <Chip
                                label={payment.transaction_id}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                            <Chip
                              icon={getStatusIcon(payment.status)}
                              label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              color={getStatusColor(payment.status) as any}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              ${payment.amount}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Tooltip title="View Payment Details">
                            <IconButton 
                              onClick={() => handleViewPayment(payment)}
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                },
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* PDF Documents */}
          <Box sx={{ flex: { xs: '1', lg: '0 0 40%' } }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GetApp sx={{ fontSize: '1.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Your Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download your Vastu analysis reports and certificates
                  </Typography>
                </Box>
              </Box>

              {pdfs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <GetApp sx={{ fontSize: 40, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No documents available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                    Your Vastu analysis documents will appear here once they are generated.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {pdfs.map((pdf) => (
                    <Card
                      key={pdf.id}
                      variant="outlined"
                      sx={{
                        background: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor: `${getTypeColor(pdf.type)}.light`,
                              color: `${getTypeColor(pdf.type)}.contrastText`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 40,
                              height: 40,
                            }}
                          >
                            <GetApp sx={{ fontSize: '1.2rem' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip
                                label={pdf.type.replace('_', ' ').toUpperCase()}
                                color={getTypeColor(pdf.type) as any}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem', lineHeight: 1.3 }}>
                              {pdf.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                              {pdf.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {formatFileSize(pdf.file_size)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {formatDate(pdf.created_at)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Download />}
                          onClick={() => handleDownload(pdf)}
                          sx={{
                            bgcolor: 'secondary.main',
                            '&:hover': {
                              bgcolor: 'secondary.dark',
                            },
                            fontWeight: 600,
                          }}
                        >
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
