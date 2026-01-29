"use client";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  Stack,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  Assignment,
  TrendingUp,
  Group,
  Settings,
  Logout,
  Close,
  Person,
  Security,
  AdminPanelSettings,
} from "@mui/icons-material";
import ThemeSwitcher from "@/component/ThemeSwitcher";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { useNotification } from "@/context/NotificationContext";
import { useParams } from "next/navigation";

const GET_USER = gql`
  query FindMe {
    findMe {
      organizationId {
        name
      }
      role {
        name
        permissions
      }
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

interface GetUserResult {
  findMe: {
    organizationId: {
      name: string;
    };
    role: {
      name: string;
      permissions: string[];
    };
  };
}

const drawerWidth = 240; // Desktop width

export default function DashboardDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data } = useQuery<GetUserResult>(GET_USER);
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useMutation(LOGOUT);
  const { notify } = useNotification();
  const client = useApolloClient();

  const electricBlue = "#00abb4ff";

  const allNavItems = [
    { text: "Leads", icon: <Assignment />, path: "/leads" },
    { text: "Roles", icon: <Security />, path: "/roles" },
    { text: "Overview", icon: <TrendingUp />, path: "/overview" },
    { text: "Team", icon: <Group />, path: "/team" },
    { text: "Profile", icon: <Person />, path: "/profile" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
    { text: "Super Admin", icon: <AdminPanelSettings />, path: "/superAdmin" },
  ];

  // Permissions Check
  const permissions = data?.findMe?.role?.permissions || [];
  const userRole = data?.findMe?.role?.name; // Get role name

  const navItems = allNavItems.filter((item) => {
    if (item.text === "Team") {
      return permissions.includes("users.view");
    }
    if (item.text === "Roles") {
      return permissions.includes("roles.view");
    }
    if (item.text === "Super Admin") {
      return userRole === "Super Admin"; // Only for Super Admin
    }
    return true; // Baaki sab dikhao
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken"); // 👇 Token delete karna zaruri hai
      await client.clearStore();
      notify("Logout successfully", "success");
      router.push("/login");
    } catch (error) {
      notify("Logout failed", "error");
    }
  };

  const DrawerList = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRight: { md: `1px solid ${theme.palette.divider}` },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 5, px: 1 }}
      >
        <Box>
          <Typography
            onClick={() => router.push("/")}
            variant="h6"
            sx={{ fontWeight: 900, letterSpacing: -1, cursor: "pointer" }}
          >
            SALES<span style={{ color: electricBlue }}>CRM</span>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: -0.5,
              color: theme.palette.text.secondary,
              fontWeight: 700,
            }}
          >
            {data?.findMe?.organizationId?.name}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeSwitcher />
          {/* Mobile close button */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              color: theme.palette.text.secondary,
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </Stack>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ mb: 1 }}
              component={Link}
              href={item.path}
              onClick={() => setMobileOpen(false)} // Close mobile drawer on click
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  transition: "0.3s",
                  bgcolor: isActive ? alpha(electricBlue, 0.1) : "transparent",
                  color: isActive ? electricBlue : theme.palette.text.secondary,
                  "&:hover": {
                    bgcolor: isActive
                      ? alpha(electricBlue, 0.15)
                      : alpha(theme.palette.text.primary, 0.05),
                    color: isActive ? electricBlue : theme.palette.text.primary,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 45, color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                />
              </Box>
            </ListItem>
          );
        })}
      </List>

      {/* User Card */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: "16px",
          border: `1px solid ${theme.palette.divider}`,
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}
        >
          ROLE
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
          {data?.findMe?.role?.name}
        </Typography>
      </Box>

      {/* Logout */}
      <Box
        component={Button}
        onClick={() => {
          handleLogout();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.5,
          color: "#ff4444",
          cursor: "pointer",
          borderRadius: "12px",
          "&:hover": { bgcolor: alpha("#ff4444", 0.1) },
        }}
      >
        <Logout fontSize="small" />
        <Typography sx={{ fontWeight: 700 }}>Logout</Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 1. Mobile Hamburger Icon (Sirf mobile par dikhega) */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 15,
          right: 15,
          zIndex: 1201,
          display: { md: "none" },
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": { bgcolor: theme.palette.background.paper },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* 2. Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Mobile performance
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundImage: "none",
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        {DrawerList}
      </Drawer>

      {/* 3. Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            bgcolor: "transparent",
          },
        }}
        open
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
