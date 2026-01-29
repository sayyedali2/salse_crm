"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
  Link,
  alpha,
  IconButton
} from "@mui/material";
import { 
  Close, 
  OpenInNew, 
  PersonAdd, 
  MarkEmailRead, 
  VpnKey, 
  ContentCopy 
} from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
}

// --- Guide Steps Data ---
const steps = [
  {
    label: "Create Free Account",
    icon: <PersonAdd fontSize="small" />,
    description: (
      <>
        Go to the SendGrid signup page and create a free account. You don't need a credit card for the free tier (100 emails/day).
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            endIcon={<OpenInNew />}
            href="https://signup.sendgrid.com/"
            target="_blank"
            size="small"
          >
            Go to SendGrid Signup
          </Button>
        </Box>
      </>
    ),
  },
  {
    label: "Verify Sender Identity (Important)",
    icon: <MarkEmailRead fontSize="small" />,
    description: (
      <>
        Before sending emails, SendGrid needs to know who you are.
        <ul style={{ paddingLeft: 20, marginTop: 10, marginBottom: 10 }}>
          <li>Go to <b>Settings</b> &rarr; <b>Sender Authentication</b>.</li>
          <li>Click on <b>Verify a Single Sender</b> (Easiest for start).</li>
          <li>Fill in your name and the email address you want to send from (e.g., info@yourcompany.com).</li>
          <li><b>Check your inbox</b> and click the verification link sent by SendGrid.</li>
        </ul>
      </>
    ),
  },
  {
    label: "Generate API Key",
    icon: <VpnKey fontSize="small" />,
    description: (
      <>
        Now, let's get the key to connect your CRM.
        <ul style={{ paddingLeft: 20, marginTop: 10, marginBottom: 10 }}>
          <li>Go to <b>Settings</b> &rarr;on the left sidebar.</li>
          <li>Click on Email Service <b>fill the form</b> and click on <b>submit</b> button.</li>
        </ul>
      </>
    ),
  },
  {
    label: "Copy & Paste",
    icon: <ContentCopy fontSize="small" />,
    description: (
      <Box 
        sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
          border: '1px dashed',
          borderColor: 'error.main'
        }}
      >
        <Typography variant="body2" color="error" fontWeight="bold">
          ⚠️ Warning: This Key is shown only ONCE!
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Copy the long key starting with <code>SG.xxxx...</code> immediately. 
          Paste it into your CRM Settings page and click Save.
        </Typography>
      </Box>
    ),
  },
];

export default function SendGridGuide({ open, onClose }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 } // Modern rounded look
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">SendGrid Setup Guide</Typography>
          <Typography variant="caption" color="text.secondary">
            Follow these steps to enable email automation.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                StepIconProps={{
                   sx: { 
                     '&.Mui-active': { color: 'text.primary' }, // Black in Light, White in Dark
                     '&.Mui-completed': { color: 'success.main' },
                   }
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight="600">{step.label}</Typography>
                </Box>
              </StepLabel>
              
              <StepContent>
                <Box sx={{ mb: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                  {step.description}
                </Box>
                
                {/* Navigation Buttons inside Step */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? onClose : handleNext}
                    sx={{ mt: 1, mr: 1, fontWeight: 'bold' }}
                    size="small"
                  >
                    {index === steps.length - 1 ? "Finish" : "Next Step"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                    size="small"
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Box sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="success.main">
              🎉 All Steps Completed!
            </Typography>
            <Typography variant="body2">
              You can now paste your API Key in the settings form.
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1 }} size="small">
              Read Again
            </Button>
          </Box>
        )}
      </DialogContent>
      
      {/* Footer Actions */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Close Guide</Button>
      </DialogActions>
    </Dialog>
  );
}