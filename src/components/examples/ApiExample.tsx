'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth, useChat, useVastuAnalysis, useContact, useFileUpload } from '@/utils/useApi';

const ApiExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('auth');
  
  // Auth example
  const { user, loading: authLoading, error: authError, login, register, logout } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  // Chat example
  const { messages, sending, error: chatError, sendMessage, loadHistory } = useChat();
  const [newMessage, setNewMessage] = useState('');

  // Vastu analysis example
  const { analyzing, analyses, error: vastuError, analyze, loadMyAnalyses } = useVastuAnalysis();
  const [vastuData, setVastuData] = useState({ propertyType: '', direction: '' });

  // Contact form example
  const { sending: contactSending, error: contactError, success: contactSuccess, sendMessage: sendContact } = useContact();
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });

  // File upload example
  const { uploading, uploadedFiles, error: uploadError, uploadFile } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Load chat history when component mounts
    loadHistory();
  }, [loadHistory]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerData.name, registerData.email, registerData.password);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleVastuAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await analyze(vastuData.propertyType, vastuData.direction);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendContact(
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message
      );
      setContactData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send contact message:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await uploadFile(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const tabs = [
    { id: 'auth', label: 'Authentication' },
    { id: 'chat', label: 'Chat' },
    { id: 'vastu', label: 'Vastu Analysis' },
    { id: 'contact', label: 'Contact Form' },
    { id: 'upload', label: 'File Upload' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Service Examples
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1}>
          {tabs.map((tab) => (
            <Grid item key={tab.id}>
              <Button
                variant={activeTab === tab.id ? 'contained' : 'outlined'}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Authentication Tab */}
      {activeTab === 'auth' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Login
                </Typography>
                {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={authLoading}
                    sx={{ mt: 2 }}
                  >
                    {authLoading ? <CircularProgress size={20} /> : 'Login'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Register
                </Typography>
                <form onSubmit={handleRegister}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={authLoading}
                    sx={{ mt: 2 }}
                  >
                    {authLoading ? <CircularProgress size={20} /> : 'Register'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {user && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current User
                  </Typography>
                  <Typography>Name: {user.name}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Role: {user.role}</Typography>
                  <Button onClick={logout} variant="outlined" sx={{ mt: 2 }}>
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chat Messages
                </Typography>
                {chatError && <Alert severity="error" sx={{ mb: 2 }}>{chatError}</Alert>}
                <Box sx={{ height: 400, overflowY: 'auto', border: 1, borderColor: 'divider', p: 2, mb: 2 }}>
                  {messages.map((message) => (
                    <Box key={message.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {message.role === 'user' ? 'You' : 'Assistant'} - {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                      <Typography>{message.content}</Typography>
                    </Box>
                  ))}
                </Box>
                <form onSubmit={handleSendMessage}>
                  <TextField
                    fullWidth
                    label="Type your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={sending || !newMessage.trim()}
                    sx={{ mt: 1 }}
                  >
                    {sending ? <CircularProgress size={20} /> : 'Send'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Vastu Analysis Tab */}
      {activeTab === 'vastu' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vastu Analysis
                </Typography>
                {vastuError && <Alert severity="error" sx={{ mb: 2 }}>{vastuError}</Alert>}
                <form onSubmit={handleVastuAnalysis}>
                  <TextField
                    fullWidth
                    label="Property Type"
                    value={vastuData.propertyType}
                    onChange={(e) => setVastuData({ ...vastuData, propertyType: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Direction"
                    value={vastuData.direction}
                    onChange={(e) => setVastuData({ ...vastuData, direction: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={analyzing}
                    sx={{ mt: 2 }}
                  >
                    {analyzing ? <CircularProgress size={20} /> : 'Analyze'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>
                {analyses.map((analysis) => (
                  <Paper key={analysis.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1">Property: {analysis.property_type}</Typography>
                    <Typography variant="body2">Direction: {analysis.direction}</Typography>
                    <Typography variant="body2">Score: {analysis.score}</Typography>
                    <Typography variant="body2">Date: {new Date(analysis.created_at).toLocaleDateString()}</Typography>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Contact Form Tab */}
      {activeTab === 'contact' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Form
                </Typography>
                {contactError && <Alert severity="error" sx={{ mb: 2 }}>{contactError}</Alert>}
                {contactSuccess && <Alert severity="success" sx={{ mb: 2 }}>Message sent successfully!</Alert>}
                <form onSubmit={handleContactSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={contactSending}
                    sx={{ mt: 2 }}
                  >
                    {contactSending ? <CircularProgress size={20} /> : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* File Upload Tab */}
      {activeTab === 'upload' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  File Upload
                </Typography>
                {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  variant="contained"
                  onClick={handleFileUpload}
                  disabled={uploading || !selectedFile}
                  sx={{ mt: 1 }}
                >
                  {uploading ? <CircularProgress size={20} /> : 'Upload File'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Files
                </Typography>
                <List>
                  {uploadedFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.filename}
                        secondary={`Size: ${file.size} bytes`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ApiExample; 