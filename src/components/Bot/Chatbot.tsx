'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import Lottie from 'lottie-react'; // Import Lottie
import happyAnimation from '../../../public/smile.json'; // Example: Replace with your downloaded JSON files
//import idleAnimation from './animations/idle.json';
import thinkingAnimation from '../../../public/thinking.json';
import confusedAnimation from '../../../public/confusion.json';
import errorAnimation from '../../../public/error.json';
import excitedAnimation from '../../../public/smile.json';
// import sadAnimation from './animations/sad.json';
import sleepingAnimation from '../../../public/sleeping.json';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useDeviceType } from '@/utils/useDeviceType';


interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [serverDown, setServerDown] = useState(false);
  const [apiNotCalled, setApiNotCalled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use theme and device type for all sizing, paddings, and colors
  const { theme } = useThemeContext();
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  const CHAT_LIMIT = 100;

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat count from localStorage only on client
  useEffect(() => {
    if (isClient) {
      const storedCount = localStorage.getItem('chatCount');
      if (storedCount) {
        setChatCount(parseInt(storedCount, 10));
      }
    }
  }, [isClient]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && isClient) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hello! I'm your VastuMitra. Ask me anything, and I'll respond dynamically. You have 100 chats available.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, isClient]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isClient) return;

    // Check chat limit
    if (chatCount >= CHAT_LIMIT) {
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random()}`,
        text: "You've reached the maximum of 100 chats. Please reset your session to continue.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setApiNotCalled(false);
    setServerDown(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        setServerDown(true);
        throw new Error('Server is down');
      }

      const data = await response.json();
      if (data.response === "Sorry, I'm having trouble processing your message. Please try again.") {
        setApiNotCalled(true);
      }

      const botResponseText = data.response;

      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random()}`,
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Increment chat count
      const newCount = chatCount + 1;
      setChatCount(newCount);
      if (isClient) {
        localStorage.setItem('chatCount', newCount.toString());
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random()}`,
        text: "Sorry, I'm having trouble processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    if (!isClient) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAnimation = () => {
    if (isLoading) return thinkingAnimation;
    if (serverDown) return errorAnimation; // 404 animation for server down
    if (apiNotCalled) return confusedAnimation; // Confusion animation for predefined text
    if (inputMessage.trim()) return excitedAnimation; // Excited animation when typing
    return sleepingAnimation; // Sleeping animation when not typing
  };

  // Don't render anything until client-side
  if (!isClient) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <>
      <Fab
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 1100,
          width: isMobile ? 36 : 48,
          height: isMobile ? 36 : 48,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[8],
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            transform: 'scale(1.1)',
            boxShadow: theme.shadows[12],
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ChatIcon sx={{ fontSize: isMobile ? 24 : 30 }} />
      </Fab>
  
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: isMobile ? '60vh' : '70vh',
            maxHeight: isMobile ? '400px' : '600px',
            borderRadius: '20px',
            background: theme.palette.background.default,
            boxShadow: theme.shadows[6],
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.background.paper})`,
            color: theme.palette.primary.contrastText,
            padding: isMobile ? '12px 16px' : '16px 24px',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 40, height: 40 }}>
              <Lottie
                animationData={getAnimation()}
                loop={true}
                autoplay={true}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.palette.common.white }}
            >
              VastuMitra
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: theme.palette.common.white,
              '&:hover': {
                background: theme.palette.grey[200],
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', background: theme.palette.background.paper }}>
          {chatCount >= CHAT_LIMIT && (
            <Alert
              severity="warning"
              sx={{ m: 2, mb: 0, borderRadius: '12px', background: theme.palette.warning.light }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setChatCount(0);
                    if (isClient) {
                      localStorage.setItem('chatCount', '0');
                    }
                    setMessages([]);
                  }}
                  sx={{
                    color: theme.palette.warning.contrastText,
                    '&:hover': {
                      background: theme.palette.warning.main,
                      color: theme.palette.warning.contrastText,
                    },
                  }}
                >
                  Reset
                </Button>
              }
            >
              Chat limit of 100 reached. Reset to continue.
            </Alert>
          )}
          {chatCount < CHAT_LIMIT && (
            <Alert
              severity="info"
              sx={{
                m: 2,
                mb: 0,
                borderRadius: '12px',
                background: theme.palette.info.light,
                color: theme.palette.info.contrastText,
              }}
            >
              {`Chats remaining: ${CHAT_LIMIT - chatCount}`}
            </Alert>
          )}
  
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {!message.isUser && (
                  <Box sx={{ width: 32, height: 32 }}>
                    <Lottie
                      animationData={getAnimation()}
                      loop={true}
                      autoplay={true}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: message.isUser
                        ? theme.palette.primary.main
                        : theme.palette.mode === 'dark'
                          ? theme.palette.grey[800] // darker bubble for dark mode
                          : theme.palette.grey[100], // light bubble for light mode

                      color: message.isUser
                        ? theme.palette.primary.contrastText
                        : theme.palette.mode === 'dark'
                          ? theme.palette.grey[100] // light text on dark bubble
                          : theme.palette.text.primary, // normal text in light mode

                      borderRadius: '16px',
                      boxShadow: theme.shadows[3],
                      '&:hover': { boxShadow: theme.shadows[6] },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: message.isUser
                          ? theme.palette.primary.contrastText
                          : theme.palette.mode === 'dark'
                            ? theme.palette.grey[100]
                            : theme.palette.text.primary,
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>


                  <Typography
                    variant="caption"
                    sx={{ mt: 0.5, color: theme.palette.text.secondary, fontSize: '0.75rem' }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
                {message.isUser && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            ))}
  
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                <Box sx={{ width: 32, height: 32 }}>
                  <Lottie
                    animationData={thinkingAnimation}
                    loop={true}
                    autoplay={true}
                  />
                </Box>
                <Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: theme.palette.grey[100],
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
            <Box ref={messagesEndRef} />
          </Box>
  
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
              background: theme.palette.background.paper,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading || chatCount >= CHAT_LIMIT}
              variant="outlined"
              sx={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: theme.palette.background.default,
                  '& fieldset': { borderColor: theme.palette.grey[300], borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                },
                '& .MuiInputBase-input': { color: theme.palette.text.primary },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || chatCount >= CHAT_LIMIT}
              color="primary"
              sx={{
                alignSelf: 'flex-end',
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  background: theme.palette.primary.dark,
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  background: theme.palette.grey[400],
                  color: theme.palette.grey[600],
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;