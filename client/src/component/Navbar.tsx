"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger Icon
import Link from "next/link";

export default function Navbar() {
  // Mobile Menu ke liye state
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ================= LOGO (Always Visible) ================= */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: "#1a2027",
              fontWeight: "bold",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            🚀 SALES<span style={{ color: "#3f51b5" }}>PILOT</span>
          </Typography>

          {/* ================= DESKTOP MENU (Hidden on Mobile) ================= */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Link href="/" passHref style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                startIcon={<AddCircleIcon />}
                sx={{
                  color: "#555",
                  "&:hover": { color: "#3f51b5", bgcolor: "#f0f4ff" },
                }}
              >
                New Lead Form
              </Button>
            </Link>

            <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                sx={{
                  bgcolor: "#3f51b5",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#2c387e", boxShadow: "none" },
                }}
              >
                Dashboard
              </Button>
            </Link>
          </Box>

          {/* ================= MOBILE MENU (Hidden on Desktop) ================= */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ color: "#3f51b5" }} // Hamburger color
            >
              <MenuIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* Menu Item 1: New Lead */}
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  href="/"
                  passHref
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <AddCircleIcon sx={{ color: "#3f51b5" }} />
                  <Typography textAlign="center">New Lead Form</Typography>
                </Link>
              </MenuItem>

              {/* Menu Item 2: Dashboard */}
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  href="/dashboard"
                  passHref
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <DashboardIcon sx={{ color: "#3f51b5" }} />
                  <Typography textAlign="center">Dashboard</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}