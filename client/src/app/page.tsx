"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  InputAdornment,
  CssBaseline,
  CircularProgress,
  Container,
  Grid,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import {
  PhoneIphone,
  PersonOutline,
  MailOutline,
  Code,
  ArrowForward,
  RocketLaunch,
  CheckCircle
} from "@mui/icons-material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

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

// --- STYLED COMPONENTS ---
const HeroSection = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  background: "#f8fafc", // Very light slate
  // Subtle Light Mesh Gradient
  backgroundImage: `
    radial-gradient(at 0% 0%, hsla(253,16%,96%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,94%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,96%,1) 0, transparent 50%)
  `,
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  padding: "40px 0"
});

const LightCard = styled(motion.div)({
  background: "#ffffff",
  borderRadius: "24px",
  // Soft Corporate Shadow
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", 
  padding: "48px",
  width: "100%",
  maxWidth: "550px",
  position: "relative",
  zIndex: 10,
  border: "1px solid #f1f5f9"
});

const LightInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#334155", // Dark Grey Text
    borderRadius: "12px",
    backgroundColor: "#f1f5f9", // Light Grey Input Bg
    transition: "all 0.2s ease",
    "& fieldset": { 
        borderColor: "#e2e8f0",
        borderWidth: "1px"
    },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { 
        borderColor: "#6366f1", // Indigo focus
        borderWidth: "2px"
    },
    "&.Mui-focused": { backgroundColor: "#ffffff" }
  },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  "& .MuiInputAdornment-root": { color: "#94a3b8" },
  "& .MuiSvgIcon-root": { color: "#64748b" },
});

export default function LightLandingPage() {
  const [msg, setMsg] = useState<{
    type: "success" | "error" | "info" | null;
    text: string;
  }>({ type: null, text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: undefined,
      serviceType: "Web Development",
    },
  });

  const [createLead, { loading }] = useMutation(CREATE_LEAD_MUTATION);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setMsg({ type: null, text: "" });
    try {
      const response = await createLead({
        variables: {
          createLeadInput: { ...data, budget: Number(data.budget) },
        },
      });
      const status = response.data.createLead.status;

      if (status === "QUALIFIED")
        setMsg({
          type: "success",
          text: "🚀 Accepted! Check your inbox for the meeting link.",
        });
      else if (status === "REJECTED")
        setMsg({
          type: "error",
          text: "⚠️ Project requirements do not match our current scope.",
        });
      else
        setMsg({
          type: "info",
          text: "📩 Application Received. We will contact you.",
        });

      reset({
        name: "",
        email: "",
        phone: "",
        budget: 0,
        serviceType: "Web Development",
      });
    } catch (err) {
      setMsg({ type: "error", text: "Submission failed. Please try again." });
    }
  };

  return (
    <HeroSection>
      <CssBaseline />
      
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          
          {/* Left Text */}
          <Grid item xs={12} md={6}>
             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
               <Chip 
                  label="🚀 Now Accepting New Projects" 
                  sx={{ bgcolor: "#eef2ff", color: "#6366f1", fontWeight: "bold", mb: 3 }} 
               />
               
               <Typography variant="h2" fontWeight="900" color="#0f172a" lineHeight={1.2} mb={3}>
                  Build Faster.<br/>Scale Smarter.
               </Typography>
               
               <Typography variant="h6" color="#64748b" mb={4} fontWeight="400" lineHeight={1.6}>
                  We transform complex ideas into elegant software solutions. Get a free estimation instantly.
               </Typography>

               <Box display="flex" flexDirection="column" gap={2}>
                  {[
                    "AI-Powered Automation",
                    "Custom Web & App Development",
                    "Enterprise Scalability"
                  ].map((item, i) => (
                    <Box key={i} display="flex" alignItems="center" gap={2}>
                       <CheckCircle sx={{ color: "#10b981" }} />
                       <Typography fontWeight="500" color="#334155">{item}</Typography>
                    </Box>
                  ))}
               </Box>
             </motion.div>
          </Grid>

          {/* Right Form Card */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <LightCard
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box mb={4}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                   <RocketLaunch sx={{ color: "#6366f1" }} />
                   <Typography variant="h6" fontWeight="bold" color="#0f172a">
                     Start Your Project
                   </Typography>
                </Box>
                <Typography variant="body2" color="#64748b">
                   Fill in the details below to get an instant estimation.
                </Typography>
              </Box>

              {msg.text && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Alert
                    severity={msg.type || "info"}
                    sx={{ mb: 3, borderRadius: "12px" }}
                  >
                    {msg.text}
                  </Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2.5}>
                
                <LightInput
                  fullWidth label="Full Name" placeholder="John Doe" variant="outlined"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutline /></InputAdornment> }}
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name} helperText={errors.name?.message}
                />

                <LightInput
                  fullWidth label="Email Address" placeholder="john@example.com" variant="outlined"
                  InputProps={{ startAdornment: <InputAdornment position="start"><MailOutline /></InputAdornment> }}
                  {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  error={!!errors.email} helperText={errors.email?.message}
                />

                <LightInput
                  fullWidth label="Phone Number" placeholder="+91 9876543210" variant="outlined"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphone /></InputAdornment> }}
                  {...register("phone", { required: "Phone required", minLength: { value: 10, message: "Min 10 digits" } })}
                  error={!!errors.phone} helperText={errors.phone?.message}
                />

                <Grid container spacing={2}>
                   <Grid item xs={6}>
                      <LightInput
                        fullWidth label="Budget (₹)" type="number" variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start"><MonetizationOnOutlinedIcon /></InputAdornment> }}
                        {...register("budget", { required: "Required" })}
                        error={!!errors.budget} helperText={errors.budget?.message}
                      />
                   </Grid>
                   <Grid item xs={6}>
                      <LightInput
                        select fullWidth label="Service" defaultValue="Web Development" variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start"><Code /></InputAdornment> }}
                        {...register("serviceType")}
                      >
                        <MenuItem value="Web Development">Web Dev</MenuItem>
                        <MenuItem value="App Development">App Dev</MenuItem>
                        <MenuItem value="AI Automation">AI Automation</MenuItem>
                      </LightInput>
                   </Grid>
                </Grid>

                <Button
                  type="submit" fullWidth size="large" disabled={loading}
                  endIcon={!loading && <ArrowForward />}
                  sx={{
                    mt: 2, py: 1.8, fontSize: "1rem", fontWeight: "bold", textTransform: "none", borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    color: "white",
                    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)"
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Get Estimation"}
                </Button>

                <Box mt={2} textAlign="center">
                   <Link href="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
                      Admin Access <span style={{ color: '#6366f1', fontWeight: 'bold' }}>&rarr;</span>
                   </Link>
                </Box>

              </Box>
            </LightCard>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
}