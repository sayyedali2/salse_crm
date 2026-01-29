"use client";

// --- REUSABLE 3D TILT WRAPPER (For Cards & Code) ---

import { Box } from "@mui/material";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useState } from "react";

export const TiltWrapper = ({ children, height = "400px", delay = 0 }: any) => {
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
