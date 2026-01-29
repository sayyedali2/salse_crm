"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";

import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

import { TiltWrapper } from "../component/landingPage/tiltWrapper";
import { VoidGateLoader } from "../component/landingPage/voidGateLoader";
import { CodeTyper } from "../component/landingPage/codeTyper";
import { ReactorCore } from "../component/landingPage/reactorCore";
import { PremiumContact } from "../component/landingPage/premiumContact";
import { FloatingDock } from "../component/landingPage/floatingDock";
import { UltimateCardContent } from "../component/landingPage/ultimateCardContent";
import { VelocityText } from "../component/landingPage/velocityText";

// ICONS
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import HexagonIcon from "@mui/icons-material/Hexagon";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";

// --- SMOOTH SCROLL IMPORTS ---
// IMPORTANT: npm install @studio-freight/react-lenis
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRouter } from "next/navigation";
import InitilaizedSystem from "@/component/InitilaziedSystem/initilaziedSystem";

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style jsx global>{`
    html {
      scroll-behavior: auto;
    } /* Let Lenis handle scrolling */
    body {
      overflow-x: hidden;
      background-color: #050505;
      cursor: none;
      margin: 0;
    }
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: #000;
    }
    ::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #00f3ff;
    }
    ::selection {
      background: #00f3ff;
      color: #000;
    }
  `}</style>
);

// --- HOOKS ---
const useMouse = () => {
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) };
  useEffect(() => {
    if (typeof window === "undefined") return;
    const manageMouseMove = (e: any) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };
    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, []);
  return mouse;
};

// --- VISUAL ASSETS ---

const TopGlow = () => (
  <Box
    sx={{
      position: "absolute",
      top: "-10%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100vw",
      height: "800px",
      background:
        "radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, rgba(120, 119, 198, 0.05) 40%, transparent 70%)",
      filter: "blur(100px)",
      zIndex: 0,
      pointerEvents: "none",
    }}
  />
);

const BackgroundLayer = () => (
  <Box sx={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: Math.random() * -1000, opacity: 0 }}
        animate={{ y: ["0vh", "100vh"], opacity: [0, 0.8, 0] }}
        transition={{
          duration: Math.random() * 15 + 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          backgroundColor: "#fff",
          borderRadius: "50%",
        }}
      />
    ))}
  </Box>
);

// --- MAIN COMPONENT: FLOATING DOCK ---
const protocol: any = [
  {
    title: "Tenant Isolation & Security",
    des: "Enforcing strict data separation and secure access to protect every organization across the platform.",
  },
  {
    title: "Sales Pipeline Synchronization",
    des: "Executing real-time lead and deal synchronization to keep pipelines aligned across teams and regions.",
  },
  {
    title: "Performance Optimization",
    des: "Continuously optimizing workflows to deliver high-speed operations and consistent system reliability.",
  },
  {
    title: "Global Infrastructure Stability",
    des: "Maintaining data integrity and availability across distributed nodes worldwide.",
  },
];


const MainContent = () => {
  const [open,setOpen]=useState(false);
  const router = useRouter();
  return (
    <>
    <Box sx={{ position: "relative", overflowX: "hidden" }}>
      <TopGlow />
      <BackgroundLayer />

      {/* HERO */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: "center", zIndex: 10 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Typography
              variant="caption"
              sx={{ letterSpacing: 10, color: "#888", mb: 4, display: "block" }}
            >
              SYSTEM V.5.0
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4rem", md: "9rem" },
                fontWeight: 900,
                lineHeight: 0.9,
                color: "#fff",
                textShadow: "0 0 50px rgba(0, 243, 255, 0.5)",
              }}
            >
              <motion.span
                initial={{ filter: "blur(20px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                SALES
              </motion.span>{" "}
              <br /> PILOT
            </Typography>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => setOpen(true)}
                sx={{
                  mt: 6,
                  borderRadius: 0,
                  px: 6,
                  py: 2.5,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                  fontSize: "1.2rem",
                  "&:hover": { bgcolor: "#fff", color: "#000" },
                }}
              >
                INITIALIZE YOUR SYSTEM
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          py: 6,
          bgcolor: "#ffffffff",
          color: "#000000ff",
          transform: "rotate(-1deg) scale(1.02)",
          overflow: "hidden",
        }}
      >
        <VelocityText baseVelocity={-2}>
          SALES • AUTOMATION • GROWTH •
        </VelocityText>
      </Box>

      {/* CARDS GRID */}
      <Container maxWidth="lg" sx={{ py: 20 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 4,
          }}
        >
          <TiltWrapper index={0}>
            <UltimateCardContent
              title="Sell Smarter, Not Harder"
              subtitle="Automated pipelines designed for modern sales teams."
              icon={<BlurOnIcon />}
            />
          </TiltWrapper>
          <TiltWrapper index={1}>
            <UltimateCardContent
              title="Secure by Design"
              subtitle="Built-in data isolation and role-based access for every organization."
              icon={<FingerprintIcon />}
            />
          </TiltWrapper>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: 4,
            mt: 4,
          }}
        >
          <TiltWrapper index={2}>
            <UltimateCardContent
              title="Scalable Architecture"
              subtitle="A multi-tenant foundation built to grow with your business."
              icon={<HexagonIcon />}
            />
          </TiltWrapper>
          <TiltWrapper index={3}>
            <UltimateCardContent
              title="Unified Sales Dashboard"
              subtitle="Real-time insights across leads, pipelines, and performance."
              icon={<AutoAwesomeMosaicIcon />}
            />
          </TiltWrapper>
        </Box>
      </Container>

      {/* CODE SECTION */}
      <Box sx={{ py: 15, position: "relative" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" color="#00F3FF">
                SMART ARCHITECTURE
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 4, mt: 1 }}>
                Adaptive by <br />
                Design
              </Typography>
              <Typography color="grey.500">
                The platform continuously optimizes workflows based on how your
                teams work. Intelligent modules evolve in real time to improve
                speed, accuracy, and efficiency across every tenant.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Yahan height pass karna zaroori hai */}
              <TiltWrapper height="350px">
                <CodeTyper />
              </TiltWrapper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* REACTOR SECTION */}
      <Box sx={{ py: 15, bgcolor: "rgba(255,255,255,0.01)" }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="overline" color="#00F3FF">
            POWER SOURCE
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 5 }}>
            GLOBAL SALES INFRASTRUCTURE
          </Typography>
          <ReactorCore />
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxWidth="md" sx={{ py: 20 }}>
        <Typography variant="h3" align="center" sx={{ mb: 8, fontWeight: 900 }}>
          PROTOCOLS
        </Typography>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Accordion
              sx={{
                bgcolor: "transparent",
                color: "#fff",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#00F3FF" }} />}
              >
                <Typography variant="h6">{`${protocol[i].title}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="grey.500">{`${protocol[i].des}`}</Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Container>

      <FloatingDock />

      {/* FOOTER */}
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: 5,
          pb: 5,
        }}
      >
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            px: 5,
            pb: 10,
          }}
        >
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 5 }} />

          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {" "}
            {/* Overflow hidden zaroori hai animation ke liye */}
            <Typography
              variant="overline"
              color="grey.500"
              sx={{ mb: 2, display: "block", letterSpacing: 3 }}
            >
              READY TO COLLABORATE?
            </Typography>
            {/* Naya Component Yaha Lagaya */}
            <PremiumContact />
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mt: 5 }}
            >
              <Typography
                variant="body1"
                color="grey.500"
                sx={{ cursor: "pointer", "&:hover": { color: "#00F3FF" } }}
              >
                GITHUB
              </Typography>
              <Typography
                variant="body1"
                color="grey.500"
                sx={{ cursor: "pointer", "&:hover": { color: "#00F3FF" } }}
              >
                LINKEDIN
              </Typography>
              <Typography
                variant="body1"
                color="grey.500"
                sx={{ cursor: "pointer", "&:hover": { color: "#00F3FF" } }}
              >
                EMAIL
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
    <InitilaizedSystem open={open} setOpen={setOpen}/>
    </>
  );

};


export default function App() {
  const [loading, setLoading] = useState(true);
  const mouse = useMouse();
  const smoothX = useSpring(mouse.x, { stiffness: 500, damping: 50 });
  const smoothY = useSpring(mouse.y, { stiffness: 500, damping: 50 });

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5 }}>
      <Box
        sx={{
          bgcolor: "#050505",
          minHeight: "100vh",
          color: "#fff",
          cursor: "none",
        }}
      >
        <GlobalStyles />
        <motion.div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#fff",
            mixBlendMode: "difference",
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />
        <AnimatePresence mode="wait">
          {loading ? (
            <VoidGateLoader key="loader" setLoading={setLoading} />
          ) : (
            <MainContent key="content" />
          )}
        </AnimatePresence>
      </Box>
    </ReactLenis>
  );
}



