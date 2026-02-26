"use client";
import React from 'react';
import { Box, Typography, Button, Stack, keyframes } from '@mui/material';
import { PhoneDisabled, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Gentle Attention Shake
const gentleShake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

// Soft Amber Glow
const amberPulse = keyframes`
  0% { box-shadow: 0 0 0px 0px rgba(245, 158, 11, 0.2); border-color: rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 15px 2px rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.8); }
  100% { box-shadow: 0 0 0px 0px rgba(245, 158, 11, 0.2); border-color: rgba(245, 158, 11, 0.3); }
`;

export default function VapiServiceAlert({ isEnabled }: { isEnabled: boolean }) {
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

                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.05)' : '#fffbeb',

                border: '1px solid',
                borderColor: '#f59e0b',
                animation: `${gentleShake} 0.8s cubic-bezier(.36,.07,.19,.97) both, ${amberPulse} 3s infinite ease-in-out`,
                animationDelay: '1s, 0s',

                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#fef3c7',
                }
            }}
        >
            <Stack direction="row" spacing={2.5} alignItems="center">
                <Box
                    sx={{
                        display: 'flex',
                        p: 1,
                        borderRadius: '10px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b'
                    }}
                >
                    <PhoneDisabled sx={{ fontSize: 24 }} />
                </Box>

                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f59e0b', lineHeight: 1.2 }}>
                        Vapi Calling Setup Required
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        AI calling service is inactive. Configure your Vapi API Key & Assistant ID to enable automated calls.
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
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
                    '&:hover': {
                        backgroundColor: '#d97706',
                        boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
                    }
                }}
            >
                Configure Now
            </Button>
        </Box>
    );
}
