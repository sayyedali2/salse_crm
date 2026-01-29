"use client";
import { Box } from "@mui/material";
import DashboardDrawer from "@/component/dashboard/drawer";
import Loader from "@/component/loding";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const drawerWidth = 240; // Isse drawer ki width se match karein

   const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/");
      setTimeout(() => {
      alert("You are not authorized to access this page, Please login first!");
    }, 1000);
    return
      } else {
        setIsAuthorized(true);
      }
    }, [router]);
  
    if(!isAuthorized){
      return <Loader message="Checking Authorization..." />;
    }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ 
          // Desktop pe space lega, mobile pe width 0 ho jayegi
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 } 
        }}
      >
        <DashboardDrawer />
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%", // Default 100% width
          // Desktop pe calc use karenge taki sidebar ki jagah minus ho jaye
          maxWidth: { md: `calc(100% - ${drawerWidth}px)` }, 
          mt: { xs: 8, md: 0 }, // Mobile pe Hamburger icon ke liye top margin
          transition: 'margin 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}