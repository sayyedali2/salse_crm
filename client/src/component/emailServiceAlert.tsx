"use client";
import React from 'react';
import { Box, Typography, Button, alpha, Stack, keyframes } from '@mui/material';
import { ErrorOutline, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// 1. Gentle Attention Shake (Zhatka animation)
const gentleShake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

// 2. Soft Red Glow (Saans lene wali animation)
const redPulse = keyframes`
  0% { box-shadow: 0 0 0px 0px rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 15px 2px rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.8); }
  100% { box-shadow: 0 0 0px 0px rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.3); }
`;

export default function EmailServiceAlert({ isEnabled }: { isEnabled: boolean }) {
  const router = useRouter();
  if (isEnabled) return null;

  return (
    <Box
      sx={{
        mb: 4,
        p: "16px 24px",
        borderRadius: "12px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        
        // Background: Glassy with a hint of red
        backgroundColor: (theme) => 
            theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.05)' : '#fef2f2',
        
        // Border & Animation
        border: '1px solid',
        borderColor: '#ef4444',
        animation: `${gentleShake} 0.8s cubic-bezier(.36,.07,.19,.97) both, ${redPulse} 3s infinite ease-in-out`,
        animationDelay: '1s, 0s', // Shake pehle hoga, pulse chalta rahega

        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
        }
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        {/* Animated Icon Box */}
        <Box 
          sx={{ 
            display: 'flex',
            p: 1,
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444'
          }}
        >
          <ErrorOutline sx={{ fontSize: 24 }} />
        </Box>
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
            Email Service Required
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Automated email system is inactive. Connect your API key to avoid losing leads.
          </Typography>
        </Box>
      </Stack>

      <Button
        variant="contained"
        onClick={() => router.push('/settings')}
        sx={{ 
          borderRadius: '8px',
          fontWeight: 'bold',
          px: 3,
          backgroundColor: '#ef4444',
          color: '#fff',
          textTransform: 'none',
          boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
          '&:hover': {
            backgroundColor: '#dc2626',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
          }
        }}
      >
        Configure Now
      </Button>
    </Box>
  );
}