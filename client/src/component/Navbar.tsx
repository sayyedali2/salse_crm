"use client";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from "next/link"; // Next.js Link use karein for fast navigation

export default function Navbar() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#1a2027", fontWeight: "bold", letterSpacing: 1 }}
          >
            🚀 SALES<span style={{ color: "#3f51b5" }}>PILOT</span>
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/" passHref>
              <Button 
                variant="text" 
                startIcon={<AddCircleIcon />}
                sx={{ color: "#555", '&:hover': { color: "#3f51b5", bgcolor: "#f0f4ff" } }}
              >
                New Lead Form
              </Button>
            </Link>
            
            <Link href="/dashboard" passHref>
              <Button 
                variant="contained" 
                startIcon={<DashboardIcon />}
                sx={{ bgcolor: "#3f51b5", boxShadow: "none", '&:hover': { bgcolor: "#2c387e", boxShadow: "none" } }}
              >
                Dashboard
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}