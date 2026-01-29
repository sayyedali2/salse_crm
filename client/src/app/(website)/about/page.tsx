'use client'; // <--- Yeh line add karna zaroori hai

import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, alpha, keyframes, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SecurityIcon from '@mui/icons-material/Security';
import { FloatingDock } from '@/component/landingPage/floatingDock';
import  InitilaizedSystem  from '@/component/InitilaziedSystem/initilaziedSystem';

// --- Animations ---
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AboutPage = () => {
  const electricBlue = "#00F3FF";
    const [open,setOpen] = useState(false);
  return (
    <>
   <FloatingDock/>
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', py: { xs: 8, md: 15 }, color: '#fff' }}>
      <Container maxWidth="lg">
        
        {/* --- HERO SECTION --- */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 12,
            animation: `${fadeInUp} 1s ease-out forwards` 
          }}
        >
          <Typography 
            variant="overline" 
            sx={{ 
              color: electricBlue, 
              letterSpacing: 5, 
              fontWeight: 700, 
              display: 'block', 
              mb: 2 
            }}
          >
            B2B MULTI-TENANT CRM
          </Typography>
          <Typography variant="h1" sx={{ 
            fontSize: { xs: '2.5rem', md: '4.5rem' }, 
            fontWeight: 900, 
            lineHeight: 1.1,
            mb: 4,
            color: '#fff' 
          }}>
            Manage Leads, Departments <br />
            <span style={{ color: alpha('#fff', 0.4) }}>& Employees in One Place.</span>
          </Typography>
          
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.6)', 
            maxWidth: '750px', 
            mx: 'auto',
            fontWeight: 400,
            lineHeight: 1.8 
          }}>
            Ek centralized system jahan har tenant apne sales pipeline aur workforce ko <span style={{ color: electricBlue }}>real-time</span> track kar sakta hai.
          </Typography>
        </Box>

        {/* --- CENTERED FEATURE CARDS --- */}
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Multi-Tenant Setup",
              desc: "Har organization ka apna private workspace. Data isolation hamari priority hai.",
              icon: <BusinessIcon sx={{ fontSize: 45 }} />
            },
            {
              title: "Lead Management",
              desc: "Lead creation se conversion tak, har step ko monitor aur assign karein.",
              icon: <FilterAltIcon sx={{ fontSize: 45 }} />
            },
            {
              title: "Employee Tracking",
              desc: "Kaunsa employee kitni leads handle kar raha hai, sab transparent hai.",
              icon: <BadgeIcon sx={{ fontSize: 45 }} />
            },
            {
              title: "Department Control",
              desc: "Lead types ke base par departments banayein aur team organize karein.",
              icon: <SecurityIcon sx={{ fontSize: 45 }} />
            }
          ].map((item, index) => (
            <Grid size={{xs: 12, sm: 6, md: 5}} key={index} sx={{ display: 'flex' }}>
              <Paper
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  width: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.03)', 
                  backdropFilter: 'blur(12px)',
                  borderRadius: '32px',
                  transition: '0.4s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': { 
                    transform: 'translateY(-10px)',
                    borderColor: electricBlue,
                    boxShadow: `0 20px 40px ${alpha(electricBlue, 0.2)}`,
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                  }
                }}
              >
                <Box sx={{ color: electricBlue, mb: 3, display: 'flex', justifyContent: 'center' }}>
                  {item.icon}
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
                  {item.title}
                </Typography>
                
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* --- CTA SECTION --- */}
        <Box sx={{ mt: 15, textAlign: 'center' }}>
          <Box 
            component="button"
            onClick={()=>setOpen(true)}
            sx={{ 
              px: 8, py: 2.5, 
              bgcolor: '#fff', 
              color: '#000', 
              borderRadius: '50px', 
              fontWeight: 800, 
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: '0.3s',
              '&:hover': { 
                bgcolor: electricBlue, 
                color: '#fff',
                boxShadow: `0 0 30px ${alpha(electricBlue, 0.5)}`
              }
            }}
          >
            Get Started Now
          </Box>
        </Box>
      </Container>
    </Box>
    <InitilaizedSystem open={open} setOpen={setOpen}/>
     </>
  );
};

export default AboutPage;