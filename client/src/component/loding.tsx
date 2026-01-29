"use client";
import { Box, Typography } from "@mui/material";

export default function Loader({message}: {message:string}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "80vh", backgroundColor: "transparent" }}
    >
      {/* Dots Container */}
      <Box sx={{ display: "flex", gap: "12px", mb: 2 }}>
        {[0, 1, 2].map((item) => (
          <Box
            key={item}
            sx={{
              width: "16px",
              height: "16px",
              backgroundColor: "#00f3ff", // Aapka primary color
              borderRadius: "50%",
              animation: "smoothPulse 1.5s infinite ease-in-out",
              animationDelay: `${item * 0.2}s`,
              "@keyframes smoothPulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 0.4,
                },
                "50%": {
                  transform: "scale(1.5)",
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>

      {/* Loading Text */}
      <Typography
        sx={{
          color: "#555",
          fontWeight: 500,
          letterSpacing: "1px",
          fontSize: "0.9rem",
          textTransform: "uppercase",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}