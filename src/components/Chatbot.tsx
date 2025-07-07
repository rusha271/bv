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
import happyAnimation from '../../public/smile.json'; // Example: Replace with your downloaded JSON files
//import idleAnimation from './animations/idle.json';
import thinkingAnimation from '../../public/thinking.json';
import confusedAnimation from '../../public/confusion.json';
import errorAnimation from '../../public/error.json';
import excitedAnimation from '../../public/smile.json';
// import sadAnimation from './animations/sad.json';
import sleepingAnimation from '../../public/sleeping.json';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [serverDown, setServerDown] = useState(false);
  const [apiNotCalled, setApiNotCalled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CHAT_LIMIT = 100;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('chatCount');
    if (storedCount) {
      setChatCount(parseInt(storedCount, 10));
    }
  }, []);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hello! I'm your VastuMitra. Ask me anything, and I'll respond dynamically. You have 100 chats available.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check chat limit
    if (chatCount >= CHAT_LIMIT) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "You've reached the maximum of 100 chats. Please reset your session to continue.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
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
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Increment chat count
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem('chatCount', newCount.toString());
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAnimation = () => {
    if (isLoading) return thinkingAnimation;
    if (serverDown) return errorAnimation; // 404 animation for server down
    if (apiNotCalled) return confusedAnimation; // Confusion animation for predefined text
    if (inputMessage.trim()) return excitedAnimation; // Excited animation when typing
    return sleepingAnimation; // Sleeping animation when not typing
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { height: '70vh', maxHeight: '600px' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lottie
              animationData={getAnimation()}
              loop={true}
              autoplay={true}
              style={{ width: 40, height: 40 }} // Smaller icon size
            />
            <Typography variant="h6">VastuMitra</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {chatCount >= CHAT_LIMIT && (
            <Alert
              severity="warning"
              sx={{ m: 2, mb: 0 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setChatCount(0);
                    localStorage.setItem('chatCount', '0');
                    setMessages([]);
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
            <Alert severity="info" sx={{ m: 2, mb: 0 }}>
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
                  <Lottie
                    animationData={getAnimation()}
                    loop={true}
                    autoplay={true}
                    style={{ width: 32, height: 32 }} // Smaller avatar size
                  />
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
                      backgroundColor: message.isUser ? 'primary.main' : 'grey.100',
                      color: message.isUser ? 'white' : 'text.primary',
                      borderRadius: 2,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
                {message.isUser && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                <Lottie
                  animationData={thinkingAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: 32, height: 32 }} // Smaller loading avatar size
                />
                <Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: 'grey.100',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
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
              size="small"
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || chatCount >= CHAT_LIMIT}
              color="primary"
              sx={{ alignSelf: 'flex-end' }}
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