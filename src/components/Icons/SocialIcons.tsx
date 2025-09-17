import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';  
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '@/contexts/ThemeContext';

const icons = [
  { icon: <LinkedInIcon />, label: 'Linked In', href: 'https://www.linkedin.com/in/karishmakori/?originalSubdomain=in' },
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/brahmavastu.in?igsh=MTZqYWc3eDdzeXBhMg==' },
  { icon: <WhatsAppIcon />, label: 'WhatsApp', href: '9152293717' },
  { icon:<YouTubeIcon/> , label:'YouTube' , href:'https://www.youtube.com/@Brahmavastu'}
];

export default function SocialIcons({ direction = 'row' }: { direction?: 'row' | 'column' }) {
  const theme = useTheme();
  const { mode } = useThemeContext();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', sm: direction },
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        p: 2,
        background: mode === 'dark'
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: mode === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.1)'
          : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        minWidth: { xs: "90vw", sm: 480 },
        maxWidth: { xs: "90vw", sm: 480 },
      }}
    >
      {icons.map(({ icon, label, href }) => (
        <Tooltip title={label} placement="top" key={label}>
          <IconButton
            href={href}
            target="_blank"
            rel="noopener"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: mode === 'dark'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
              border: mode === 'dark'
                ? '1px solid rgba(59, 130, 246, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.1)',
              color: mode === 'dark' ? '#60a5fa' : '#1e40af',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1) translateY(-4px) rotate(5deg)',
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                boxShadow: mode === 'dark'
                  ? '0 12px 40px rgba(59, 130, 246, 0.3)'
                  : '0 12px 40px rgba(59, 130, 246, 0.2)',
                border: mode === 'dark'
                  ? '1px solid rgba(59, 130, 246, 0.4)'
                  : '1px solid rgba(59, 130, 246, 0.3)',
              },
            }}
            size="large"
            aria-label={label}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
} 