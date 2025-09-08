import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';  
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTheme } from '@mui/material/styles';

const icons = [
  { icon: <LinkedInIcon />, label: 'Linked In', href: 'https://www.linkedin.com/in/karishmakori/?originalSubdomain=in' },
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/brahmavastu.in?igsh=MTZqYWc3eDdzeXBhMg==' },
  { icon: <WhatsAppIcon />, label: 'WhatsApp', href: '9152293717' },
  { icon:<YouTubeIcon/> , label:'YouTube' , href:'https://www.youtube.com/@Brahmavastu'}
];

export default function SocialIcons({ direction = 'row' }: { direction?: 'row' | 'column' }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', sm: direction },
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        p: 1,
      }}
    >
      {icons.map(({ icon, label, href }) => (
        <Tooltip title={label} placement="top" key={label}>
          <IconButton
            href={href}
            target="_blank"
            rel="noopener"
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
              background: 'transparent',
              transition: 'transform 0.2s, background 0.2s',
              '&:hover': {
                transform: 'scale(1.15) translateY(-2px)',
                background: theme.palette.primary.main,
                color: '#fff',
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