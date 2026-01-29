"use client";

import { FloatingDock } from "@/component/landingPage/floatingDock";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  alpha,
  keyframes,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HubIcon from "@mui/icons-material/Hub";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InitilaizedSystem from "@/component/InitilaziedSystem/initilaziedSystem";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const WorksPage = () => {
  const electricBlue = "#00F3FF";
  const [open, setOpen] = React.useState(false);

  const steps = [
    {
      icon: <AppRegistrationIcon sx={{ fontSize: 40 }} />,
      title: "Tenant Registration",
      desc: "Apni organization register karein. Har tenant ko milta hai ek isolated secure database aur customized workspace.",
      color: "#fff",
    },
    {
      icon: <HubIcon sx={{ fontSize: 40 }} />,
      title: "Structure Departments",
      desc: "Apne business ke hisaab se Sales, Support ya Marketing departments banayein aur team members add karein.",
      color: electricBlue,
    },
    {
      icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />,
      title: "Lead Distribution",
      desc: "Leads ko automatically ya manually specific departments aur employees ko assign karein based on expertise.",
      color: "#fff",
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      title: "Track & Scale",
      desc: "Real-time analytics ke saath employee performance aur conversion rates track karein aur business grow karein.",
      color: electricBlue,
    },
  ];

  return (
    <>
      <FloatingDock />
      <Box
        sx={{
          bgcolor: "#000",
          minHeight: "100vh",
          py: { xs: 8, md: 15 },
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          {/* --- HEADER --- */}
          <Box
            sx={{
              textAlign: "center",
              mb: 12,
              animation: `${fadeInUp} 0.8s ease-out`,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: electricBlue, fontWeight: 700, letterSpacing: 3 }}
            >
              THE PROCESS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mt: 2,
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              How it <span style={{ color: alpha("#fff", 0.4) }}>Works.</span>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.5)",
                mt: 2,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Simplifying lead management for complex multi-tenant
              organizations.
            </Typography>
          </Box>

          {/* --- STEPS GRID --- */}
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Box
                  sx={{
                    p: 6,
                    height: "100%",
                    bgcolor: "rgba(255, 255, 255, 0.01)",
                    borderRadius: "40px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.4s ease",
                    animation: `${fadeInUp} ${0.6 + index * 0.2}s ease-out`,
                    "&:hover": {
                      borderColor: alpha(electricBlue, 0.4),
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  {/* Step Number Background */}
                  <Typography
                    variant="h1"
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: 20,
                      fontSize: "8rem",
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.03)",
                      zIndex: 0,
                    }}
                  >
                    0{index + 1}
                  </Typography>

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        color:
                          step.color === electricBlue ? electricBlue : "#fff",
                        mb: 3,
                        display: "flex",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.8,
                        fontSize: "1.1rem",
                      }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* --- BOTTOM SUMMARY --- */}
          <Box
            sx={{
              mt: 15,
              p: 8,
              textAlign: "center",
              borderRadius: "40px",
              background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)`,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
              Ready to <span style={{ color: electricBlue }}>Scale</span> your
              operations?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Box
              component={'button'}
              onClick={() => {setOpen(true)}}
                sx={{
                  px: 6,
                  py: 2,
                  bgcolor: "#fff",
                  color: "#000",
                  borderRadius: "50px",
                  fontWeight: 900,
                  cursor: "pointer",
                  "&:hover": { bgcolor: electricBlue, color: "#fff" },
                }}
              >
                Get Started Now
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
      <InitilaizedSystem open={open} setOpen={setOpen} />
    </>
  );
};

export default WorksPage;
