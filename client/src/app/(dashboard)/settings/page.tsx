"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  TextField,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { 
  Email, 
  VpnKey, 
  Person, 
  Business, 
  Notifications, 
  Settings as SettingsIcon,
  HelpOutline
} from "@mui/icons-material";
import EmailServiceEnableForm from "@/component/settings/Email/emailServiceEnableForm";


export default function Settings() {
  const [tabIndex, setTabIndex] = useState(1); // Default to Email Service


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

 

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="text.primary">
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your organization configurations and integration keys.
        </Typography>
      </Box>

      {/* Navigation Tabs (Monotone Style) */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Business />} iconPosition="start" label="General" />
          <Tab icon={<Email />} iconPosition="start" label="Email Service" />
          <Tab icon={<Notifications />} iconPosition="start" label="Alerts" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="API Access" />
        </Tabs>
      </Box>

      {/* Main Content Area (Glassmorphism Effect) */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          // Theme ke round aur border settings yahan auto-apply hongi
        }}
      >
        {tabIndex === 1 && (
          <EmailServiceEnableForm />
        )}

        {tabIndex !== 1 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Section coming soon in your monochrome dashboard.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}