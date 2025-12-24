"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion"; 
import { 
  Box, TextField, Button, Typography, MenuItem, Alert, 
  InputAdornment, CssBaseline, CircularProgress 
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import CodeIcon from '@mui/icons-material/Code';

// --- GRAPHQL ---
const CREATE_LEAD_MUTATION = gql`
  mutation CreateLead($createLeadInput: CreateLeadInput!) {
    createLead(createLeadInput: $createLeadInput) {
      status
    }
  }
`;

interface IFormInput {
  name: string;
  email: string;
  phone: string;
  budget: number;
  serviceType: string;
}

// --- CUSTOM STYLED COMPONENTS ---
const GlassCard = styled(motion.div)({
  background: "rgba(255, 255, 255, 0.05)", 
  backdropFilter: "blur(20px)",            
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  padding: "40px",
  maxWidth: "500px",
  width: "100%",
  position: "relative",
  zIndex: 10,
});

const PremiumInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#a855f7' }, 
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a855f7' },
  '& .MuiInputAdornment-root': { color: 'rgba(255,255,255,0.7)' },
  // Select Dropdown Icon Color fix
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
});

export default function PremiumLandingPage() {
  const [msg, setMsg] = useState<{ type: 'success' | 'error' | 'info' | null, text: string }>({ type: null, text: "" });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>({
    defaultValues: { name: "", email: "", phone: "", budget: undefined, serviceType: "Web Development" }
  });

  const [createLead, { loading }] = useMutation(CREATE_LEAD_MUTATION);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setMsg({ type: null, text: "" });
    try {
      const response = await createLead({ 
        variables: { createLeadInput: { ...data, budget: Number(data.budget) } } 
      });
      const status = response.data.createLead.status;
      
      if (status === "QUALIFIED") setMsg({ type: "success", text: "🚀 Accepted! Check your inbox for the meeting link." });
      else if (status === "REJECTED") setMsg({ type: "error", text: "⚠️ Project requirements do not match our current scope." });
      else setMsg({ type: "info", text: "📩 Application Received. We will contact you." });

      reset({ name: "", email: "", phone: "", budget: 0, serviceType: "Web Development" });
    } catch (err) {
      setMsg({ type: "error", text: "Submission failed. Please try again." });
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#0f172a', 
      position: 'relative',
      overflow: 'hidden',
      p: 2
    }}>
      <CssBaseline />

      {/* --- MOVING BACKGROUND ELEMENTS --- */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", top: "10%", left: "20%",
          width: "300px", height: "300px",
          background: "linear-gradient(180deg, #7c3aed 0%, #a855f7 100%)",
          filter: "blur(100px)", borderRadius: "50%", opacity: 0.4
        }}
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", bottom: "10%", right: "20%",
          width: "400px", height: "400px",
          background: "linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%)",
          filter: "blur(120px)", borderRadius: "50%", opacity: 0.4
        }}
      />

      {/* --- GLASS CARD --- */}
      <GlassCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box textAlign="center" mb={4}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
             <Typography variant="overline" color="#a855f7" fontWeight="bold" letterSpacing={2}>
               Sales Automation
             </Typography>
          </motion.div>
          
          <Typography variant="h4" fontWeight="800" sx={{ 
             background: "-webkit-linear-gradient(45deg, #fff, #94a3b8)", 
             WebkitBackgroundClip: "text", 
             WebkitTextFillColor: "transparent" 
          }}>
            Start Your Project
          </Typography>
        </Box>

        {msg.text && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert severity={msg.type as any} sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.9)' }}>
                    {msg.text}
                </Alert>
            </motion.div>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
          
          <PremiumInput
            fullWidth label="Full Name" placeholder="Enter your name" variant="outlined"
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment> }}
            {...register("name", { required: "Name is required" })}
            error={!!errors.name} helperText={errors.name?.message}
          />

          <PremiumInput
            fullWidth label="Email Address" placeholder="hello@company.com" variant="outlined"
            InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineIcon /></InputAdornment> }}
            {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
            error={!!errors.email} helperText={errors.email?.message}
          />

          <PremiumInput
            fullWidth label="Phone Number" placeholder="+91 9876543210" variant="outlined"
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneIcon /></InputAdornment> }}
            {...register("phone", { required: "Phone required", minLength: { value: 10, message: "Min 10 digits" } })}
            error={!!errors.phone} helperText={errors.phone?.message}
          />

          <Box display="flex" gap={2}>
            <PremiumInput
                fullWidth label="Budget (₹)" type="number" variant="outlined"
                InputProps={{ startAdornment: <InputAdornment position="start"><MonetizationOnOutlinedIcon /></InputAdornment> }}
                {...register("budget", { required: "Budget required" })}
                error={!!errors.budget} helperText={errors.budget?.message}
            />
            
            {/* ✅ FIXED TAG HERE: Changed </TextField> to </PremiumInput> */}
            <PremiumInput
                select fullWidth label="Service" defaultValue="Web Development" variant="outlined"
                InputProps={{ startAdornment: <InputAdornment position="start"><CodeIcon /></InputAdornment> }}
                {...register("serviceType")}
            >
                <MenuItem value="Web Development">Web Dev</MenuItem>
                <MenuItem value="App Development">App Dev</MenuItem>
                <MenuItem value="AI Automation">AI Automation</MenuItem>
            </PremiumInput>
          </Box>

          <Button
            type="submit" fullWidth size="large"
            disabled={loading}
            sx={{
              py: 1.8,
              fontSize: '1rem', fontWeight: 'bold', textTransform: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.2s',
              '&:hover': {
                 transform: 'scale(1.02)',
                 background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Get Instant Quote 🚀"}
          </Button>

          <Typography variant="caption" textAlign="center" color="rgba(255,255,255,0.5)">
             Admin? <a href="/dashboard" style={{ color: '#a855f7', textDecoration: 'none' }}>Login to Dashboard</a>
          </Typography>

        </Box>
      </GlassCard>
    </Box>
  );
}