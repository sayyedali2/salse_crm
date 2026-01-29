"use client";

// REACTOR CORE (FIXED CENTER)

import { Box } from "@mui/material";
import { motion } from "framer-motion";

export const ReactorCore = () => (
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
