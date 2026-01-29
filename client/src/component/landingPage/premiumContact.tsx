"use client";

import { Box, Typography } from "@mui/material";

export const PremiumContact = () => {
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
