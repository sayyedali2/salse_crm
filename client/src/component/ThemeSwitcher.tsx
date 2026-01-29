'use client'; // Client component hona zaroori hai

import { useContext } from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '@/Theme/ThemeRegistry'; // Context import karein

export default function ThemeSwitcher() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Toggle function yahan se milega

  return (
    <IconButton 
      onClick={colorMode.toggleColorMode} 
      color="inherit"
      sx={{ 
        border: '1px solid rgba(255, 253, 253, 0.1)', 
        borderRadius: 2 
      }}
    >
      {/* Agar dark hai to Sun icon, light hai to Moon icon */}
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}