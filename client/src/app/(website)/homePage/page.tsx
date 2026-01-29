"use client";

import React, { useState, useEffect, useRef } from "react";
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
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// ICONS
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import HexagonIcon from "@mui/icons-material/Hexagon";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";

// --- SMOOTH SCROLL IMPORTS ---
// IMPORTANT: npm install @studio-freight/react-lenis
import { ReactLenis } from "@studio-freight/react-lenis";

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

// --- REUSABLE 3D TILT WRAPPER (For Cards & Code) ---
const TiltWrapper = ({ children, height = "400px", delay = 0 }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const [zIndex, setZIndex] = useState(1);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
        zIndex: zIndex,
        position: "relative",
        height: height, // Critical: Outer height
        width: "100%", // Critical: Outer width
        display: "flex", // FIX: Flex use kiya taaki children expand ho
        justifyContent: "center",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      onMouseEnter={() => setZIndex(10)}
      onMouseLeave={() => {
        setZIndex(1);
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          height: "100%",
          width: "100%",
          background: "rgba(20, 20, 20, 0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          position: "relative",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          display: "flex", // FIX: Content align karne ke liye
          flexDirection: "column",
          overflow: "hidden", // FIX: Border ke bahar kuch na nikle
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Background Gradient */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            background: useMotionTemplate`radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 80%)`,
            pointerEvents: "none",
          }}
        />

        {/* Content Container - Fixed 3D transform */}
        <Box
          sx={{
            position: "relative", // Changed from absolute to relative to fill space naturally
            width: "100%",
            height: "100%",
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </Box>
      </motion.div>
    </motion.div>
  );
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

const VoidGateLoader = ({ setLoading }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3800);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 2],
            opacity: [0, 1, 0],
            rotate: i % 2 === 0 ? 180 : -180,
          }}
          transition={{ duration: 3, delay: i * 0.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "50%",
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1, 150] }}
        transition={{ duration: 1.5, delay: 2.5, ease: "circIn" }}
        style={{
          width: "50px",
          height: "50px",
          background: "#fff",
          borderRadius: "50%",
          zIndex: 10000,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 100,
          color: "#fff",
          letterSpacing: 5,
        }}
      >
        SYSTEM INITIALIZATION
      </Typography>
    </motion.div>
  );
};

const CodeTyper = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const codeString = `
async function startSalesEngine() {
  const system = await CRM.initialize();

  if (system.status === "READY") {
    return CRM.launch({
      tenants: "MULTIPLE",
      pipelines: "ACTIVE",
      performance: "HIGH"
    });
  }
}
// SYSTEM READY.`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(codeString.substring(0, i));
      i++;
      if (i > codeString.length) i = 0;
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Window Controls */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexShrink: 0 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "#ff5f56",
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "#ffbd2e",
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "#27c93f",
          }}
        />
      </Stack>

      {/* Code Text Area */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          overflow: "hidden", // Extra overflow protection
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Fira Code", monospace',
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" }, // Responsive font
            color: "#a5a5a5",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          <span style={{ color: "#c792ea" }}>const</span>{" "}
          <span style={{ color: "#82aaff" }}>System</span> ={" "}
          <span style={{ color: "#c3e88d" }}>require</span>(
          <span style={{ color: "#f78c6c" }}>'universe'</span>);
          <br />
          {displayedCode}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: "#00F3FF", marginLeft: "4px" }}
          >
            ▋
          </motion.span>
        </Typography>
      </Box>
    </Box>
  );
};

const UltimateCardContent = ({ title, subtitle, icon }: any) => (
  <Box
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "16px",
          bgcolor: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "grey.500", lineHeight: 1.6 }}>
        {subtitle}
      </Typography>
    </Box>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ opacity: 0.6 }}
    >
      <Typography variant="button" fontWeight="bold">
        DEPLOY
      </Typography>
      <NorthEastIcon fontSize="small" />
    </Stack>
  </Box>
);

// 6. REACTOR CORE (FIXED CENTER)
const ReactorCore = () => (
  <Box
    sx={{
      width: "100%",
      height: "500px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      perspective: "1000px",
    }}
  >
    {/* Container that holds everything perfectly in the middle */}
    <Box
      sx={{
        position: "relative",
        width: 300,
        height: 300,
        transformStyle: "preserve-3d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* The Earth Core (Absolute Center) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 40px #00F3FF",
            "0 0 100px #00F3FF",
            "0 0 40px #00F3FF",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#fff",
          zIndex: 10,
        }}
      />

      {/* Rings - Using absolute position on a fixed 300px container guarantees centering */}
      {/* Ring 1 */}
      <motion.div
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "2px solid rgba(0,243,255,0.3)",
          borderRadius: "50%",
          borderLeftColor: "#00F3FF",
        }}
      />
      {/* Ring 2 */}
      <motion.div
        animate={{ rotateY: -360, rotateZ: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          border: "1px dashed rgba(255,255,255,0.3)",
          borderRadius: "50%",
        }}
      />
      {/* Ring 3 */}
      <motion.div
        animate={{ rotateX: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          border: "1px dotted rgba(255,255,255,0.2)",
          borderRadius: "50%",
        }}
      />
    </Box>
  </Box>
);

const VelocityText = ({ baseVelocity = 100, children }: any) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${v}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <Box
      sx={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", py: 2 }}
    >
      <motion.div style={{ x, display: "flex", gap: "50px" }}>
        {[...Array(4)].map((_, i) => (
          <Typography
            key={i}
            variant="h1"
            sx={{
              fontSize: "8rem",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#2c2c2cff",
              WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              fontFamily: '"Oswald", sans-serif',
            }}
          >
            {children}
          </Typography>
        ))}
      </motion.div>
    </Box>
  );
};

const PremiumContact = () => {
  const text = "CONTACT";
  const characters = text.split("");

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
        cursor: "pointer",
        // Container par hover lagayenge taaki saare letters react karein
        "&:hover .letter-wrapper": {
          transform: "translateY(-100%)",
        },
      }}
    >
      {characters.map((char, index) => (
        <Box
          key={index}
          sx={{
            position: "relative",
            overflow: "hidden",
            height: { xs: "3rem", md: "11rem" }, // Height fix karni padegi font size ke hisaab se
            lineHeight: 0.85,
            fontSize: { xs: "3rem", md: "11rem" },
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 900,
          }}
        >
          {/* Moving Container */}
          <Box
            className="letter-wrapper"
            sx={{
              transition: "transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)", // Premium Easing
              transitionDelay: `${index * 0.05}s`, // Stagger effect (Wave)
              height: "80%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 1. ORIGINAL LETTER (Grey/Dull) */}
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                color: "rgba(255, 255, 255, 0.25)", // Faint Classy Grey
                display: "block",
                height: "100%",
              }}
            >
              {char}
            </Typography>

            {/* 2. NEW LETTER (Pure White) - Comes from bottom */}
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                color: "#FFFFFF", // Pure Premium White
                display: "block",
                height: "100%",
              }}
            >
              {char}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
const MagneticItem = ({ children }: any) => {
  const ref: any = useRef(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: any) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Calculate center
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Move slightly towards mouse (Magnetic Pull)
    position.x.set(middleX * 0.3); // 0.3 is the pull strength
    position.y.set(middleY * 0.3);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  // Smooth spring physics for distinct "jelly" feel
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

// --- MAIN COMPONENT: FLOATING DOCK ---
const FloatingDock = () => {
  const navItems = ["Home", "Works", "About", "Contact"];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          bgcolor: "rgba(20, 20, 20, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50px",
          px: 3,
          py: 2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        {navItems.map((item) => (
          <MagneticItem key={item}>
            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "30px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&:hover .bg-hover": { opacity: 1 },
              }}
            >
              {/* Hover Background Glow */}
              <Box
                className="bg-hover"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255,255,255,0.1)",
                  opacity: 0,
                  transition: "0.3s",
                  borderRadius: "30px",
                }}
              />

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {item}
              </Typography>
            </Box>
          </MagneticItem>
        ))}
      </Box>
    </Box>
  );
};

const protocol:any = [{title:'Tenant Isolation & Security', des: 'Enforcing strict data separation and secure access to protect every organization across the platform.'},{title:'Sales Pipeline Synchronization',des:'Executing real-time lead and deal synchronization to keep pipelines aligned across teams and regions.'},{title:"Performance Optimization",des:'Continuously optimizing workflows to deliver high-speed operations and consistent system reliability.'},{title:'Global Infrastructure Stability',des:'Maintaining data integrity and availability across distributed nodes worldwide.'}]

const MainContent = () => {
  return (
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
                SALSE
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
                Adaptive by <br />Design
              </Typography>
              <Typography color="grey.500">
               The platform continuously optimizes workflows based on how your teams work. Intelligent modules evolve in real time to improve speed, accuracy, and efficiency across every tenant.
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
                <Typography color="grey.500">
                  {`${protocol[i].des}`}
                </Typography>
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
