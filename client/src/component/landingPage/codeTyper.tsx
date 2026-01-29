"use client";

import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CodeTyper = () => {
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
