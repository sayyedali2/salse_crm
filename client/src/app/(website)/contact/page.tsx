"use client";

import { FloatingDock } from "@/component/landingPage/floatingDock";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  alpha,
  keyframes,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CREATE_INQUIRY } from "@/app/graphQL/Inquiry.graphQl";
import { useNotification } from "@/context/NotificationContext";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ContactPage = () => {
  const electricBlue = "#00F3FF";
  const { notify } = useNotification();
  const [createInquiry, { loading }] = useMutation(CREATE_INQUIRY);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.email || !formData.message) {
      notify("Please fill in required fields (Name, Email, Message)");
      return;
    }
    try {
      await createInquiry({
        variables: {
          input: {
            ...formData,
          },
        },
      });
      notify("Inquiry sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        message: "",
      });
    } catch (error: any) {
      notify(error.message || "Something went wrong sending your message.");
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(255, 255, 255, 0.02)",
      borderRadius: "16px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: alpha(electricBlue, 0.5) },
      "&.Mui-focused fieldset": { borderColor: electricBlue },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
    "& .MuiInputBase-input": { color: "#fff" },
  };

  return (
    <>
      <FloatingDock />
      <Box sx={{ bgcolor: "#000", minHeight: "100vh", py: { xs: 8, md: 15 } }}>
        {/* --- FORM SECTION (Narrow Container for Vertical Look) --- */}
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              animation: `${fadeIn} 0.8s ease-out`,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: electricBlue, fontWeight: 700, letterSpacing: 3 }}
            >
              GET IN TOUCH
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mt: 1,
                color: "#fff",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Contact Us
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 4, md: 6 },
              bgcolor: "rgba(255, 255, 255, 0.01)",
              backdropFilter: "blur(20px)",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8)",
              mb: 12,
              animation: `${fadeIn} 1s ease-out`,
            }}
          >
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={inputStyles}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={inputStyles}
                  required
                />
              </Stack>
              <TextField
                fullWidth
                label="Business Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={inputStyles}
                required
              />
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                sx={inputStyles}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                name="message"
                value={formData.message}
                onChange={handleChange}
                sx={inputStyles}
                required
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  bgcolor: electricBlue,
                  color: "#fff",
                  py: 2.2,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textTransform: "none",

                  "&:hover": {
                    bgcolor: "#00F3FF",
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 24px ${alpha(electricBlue, 0.3)}`,
                  },
                  transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* --- INFO SECTION (Wide Container for Row Alignment) --- */}
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 8, md: 4 }}
            sx={{
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            {[
              {
                icon: <EmailIcon sx={{ fontSize: 32 }} />,
                label: "Email us",
                value: "sales@yourcrm.com",
                desc: "For all business inquiries",
              },
              {
                icon: <PhoneIcon sx={{ fontSize: 32 }} />,
                label: "Call us",
                value: "+91 98765 43210",
                desc: "Mon-Fri from 9am to 6pm",
              },
              {
                icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
                label: "Visit us",
                value: "Jaipur, Rajasthan, India",
                desc: "Our main tech hub",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: { md: "350px" },
                  animation: `${fadeIn} ${1.2 + index * 0.2}s ease-out`,
                }}
              >
                <Box
                  sx={{
                    bgcolor: alpha(electricBlue, 0.1),
                    p: 2,
                    borderRadius: "20px",
                    color: electricBlue,
                    mb: 2,
                    border: `1px solid ${alpha(electricBlue, 0.2)}`,
                    display: "flex",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 0.5,
                    fontSize: "1.2rem",
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: electricBlue,
                    fontWeight: 500,
                    mb: 0.5,
                    fontSize: "1rem",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    maxWidth: "220px",
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ContactPage;
