"use client";

import { Box, Button, Link, Typography } from "@mui/material";
import { MagneticItem } from "./magneticItem";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const FloatingDock = () => {
  const [navItems, setNavItems] = useState([
    "Home",
    "Works",
    "About",
    "Contact",
  ]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setNavItems(["Home", "Works", "About", "Contact", "Dashboard"]);
    }
  }, []);
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 10, md: 15 }, // Mobile par thoda niche
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: { xs: "90%", sm: "auto" }, // Mobile par width badha di takki screen ke bahar na jaye
        maxWidth: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 0.5, sm: 1, md: 2 }, // Mobile par items ke beech jagah kam kar di
          bgcolor: "rgba(20, 20, 20, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50px",
          px: { xs: 1.5, sm: 2, md: 3 }, // Horizontal padding kam ki
          py: { xs: 1, sm: 1.5, md: 1.5 }, // Vertical padding kam ki
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => (
          <MagneticItem key={item}>
            <Box
              sx={{
                px: { xs: 1.5, sm: 2, md: 3 }, // Mobile par item ki padding kam ki
                py: 1,
                borderRadius: "30px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&:hover .bg-hover": { opacity: 1 },
              }}
            >
              <Link
                component={NextLink}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                  fontWeight: 500,
                  position: "relative",
                  textDecoration: "none",
                  zIndex: 2,
                  whiteSpace: "nowrap",
                }}
                href={
                  item === "Home"
                    ? "/"
                    : item === "Dashboard"
                      ? "/leads"
                      : `/${item.toLowerCase()}`
                }
              >
                {item}
              </Link>

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
            </Box>
          </MagneticItem>
        ))}
      </Box>
    </Box>
  );
};
