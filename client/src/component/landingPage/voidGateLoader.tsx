"use client";

import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";

export const VoidGateLoader = ({ setLoading }: any) => {
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
