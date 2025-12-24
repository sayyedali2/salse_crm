"use client";

import { useState, useEffect } from "react";
import {  gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Box, Typography, Card, CardContent, Chip, Grid, Avatar,
  IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  useTheme, Divider, Button, LinearProgress, AppBar, Toolbar, useMediaQuery, CssBaseline
} from "@mui/material";

// Icons
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Icon
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';

import Link from "next/link";

// --- GRAPHQL ---
const GET_LEADS = gql`
  query GetLeads {
    leads {
      _id
      name
      budget
      status
      serviceType
      phone
    }
  }
`;

const UPDATE_STATUS_MUTATION = gql`
  mutation UpdateStatus($id: String!, $status: String!) {
    updateLeadStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

// --- CONFIGURATION ---
const DRAWER_WIDTH = 260;
const COLUMNS: any = {
  NEW: { title: "New Leads", color: "#6366f1", bg: "#eef2ff", icon: "✨" },
  QUALIFIED: { title: "Qualified", color: "#f59e0b", bg: "#fffbeb", icon: "🔥" },
  WON: { title: "Closed Won", color: "#10b981", bg: "#ecfdf5", icon: "💰" },
  REJECTED: { title: "Rejected", color: "#ef4444", bg: "#fef2f2", icon: "❌" },
};

export default function ResponsiveDashboard() {
  const theme = useTheme();
  // Check if screen is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Removed pollInterval to stop auto-reloading/flickering
  const { data, loading, refetch } = useQuery(GET_LEADS); 
  const [updateStatus] = useMutation(UPDATE_STATUS_MUTATION);
  const [columns, setColumns] = useState<any>({ NEW: [], QUALIFIED: [], REJECTED: [], WON: [] });

  // Stats Logic
  const totalValue = data?.leads?.reduce((sum: any, lead: any) => sum + lead.budget, 0) || 0;
  const totalLeads = data?.leads?.length || 0;

  useEffect(() => {
    if (data?.leads) {
      const newCols: any = { NEW: [], QUALIFIED: [], REJECTED: [], WON: [] };
      data.leads.forEach((lead: any) => {
        if (newCols[lead.status]) newCols[lead.status].push(lead);
      });
      setColumns(newCols);
    }
  }, [data]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);
    
    // UI Update immediately
    const updatedItem = { ...movedItem, status: destination.droppableId };
    destCol.splice(destination.index, 0, updatedItem);
    setColumns({ ...columns, [source.droppableId]: sourceCol, [destination.droppableId]: destCol });

    // Backend Update
    try {
      await updateStatus({ variables: { id: draggableId, status: destination.droppableId } });
    } catch (err) { console.error(err); }
  };

  // --- DRAWER CONTENT (Shared between mobile and desktop) ---
  const drawerContent = (
    <>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 32, height: 32, bgcolor: "#6366f1", borderRadius: 2 }} />
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
          SALES<span style={{color: "#818cf8"}}>PILOT</span>
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#334155" }} />
      <List sx={{ mt: 2 }}>
        {['Dashboard', 'All Leads', 'Analytics', 'Settings'].map((text, index) => (
          <ListItem button key={text} sx={{ mb: 1, mx: 1, borderRadius: 2, bgcolor: index === 0 ? "#1e293b" : "transparent", '&:hover': { bgcolor: "#334155" } }}>
            <ListItemIcon sx={{ color: index === 0 ? "#818cf8" : "#94a3b8" }}>
              {index === 0 ? <SpaceDashboardIcon /> : index === 1 ? <PeopleAltIcon /> : <SettingsIcon />}
            </ListItemIcon>
            <ListItemText primary={text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
            <Button 
                fullWidth 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ bgcolor: "#6366f1", '&:hover': { bgcolor: "#4f46e5" }, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
                Create Lead
            </Button>
        </Link>
      </Box>
    </>
  );

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ display: 'flex', bgcolor: "#f1f5f9", minHeight: "100vh" }}>
      <CssBaseline />
      
      {/* 1. Mobile AppBar (Hamburger Menu) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          display: { sm: 'none' }, // Only show on mobile
          bgcolor: "#0f172a"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 2. Responsive Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, bgcolor: "#0f172a", color: "white" },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, bgcolor: "#0f172a", color: "white" },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 3. Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 8, sm: 0 } // Mobile me header ke liye margin
        }}
      >
        {/* Top Header (Desktop only text) */}
        <Box display={{ xs: 'none', sm: 'flex' }} justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: "#1e293b" }}>
              Pipeline Board
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your sales and track progress.
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "#cbd5e1", color: "#1e293b" }}>A</Avatar>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} mb={4}>
            {[
                { label: "Pipeline Value", val: `₹${totalValue.toLocaleString()}`, color: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" },
                { label: "Active Leads", val: totalLeads, color: "white", textColor: "black" },
                { label: "Conversion", val: "18.2%", color: "white", textColor: "black" },
            ].map((stat, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                    <Card sx={{ 
                        borderRadius: 4, 
                        background: stat.color, 
                        color: stat.textColor || 'white',
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" mt={1}>
                                {stat.val}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Mobile: Grid items stack (xs=12). Desktop: 4 columns (md=3) */}
          <Grid container spacing={3}>
            {Object.entries(COLUMNS).map(([columnId, config]: any) => (
              <Grid item xs={12} md={3} key={columnId}>
                <Box 
                  sx={{ 
                    bgcolor: "#e2e8f0", 
                    p: 2, 
                    borderRadius: 3, 
                    // Mobile pe height auto, Desktop pe fixed scrollable
                    minHeight: { xs: "auto", md: "65vh" } 
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={2} px={1}>
                    <Typography fontWeight="bold" color="#475569" display="flex" alignItems="center" gap={1}>
                      <span>{config.icon}</span> {config.title}
                    </Typography>
                    <Chip label={columns[columnId]?.length} size="small" sx={{ bgcolor: "white", fontWeight: "bold" }} />
                  </Box>

                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: "100px" }}>
                        {columns[columnId]?.map((lead: any, index: number) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ 
                                  mb: 1.5, 
                                  borderRadius: 2,
                                  boxShadow: snapshot.isDragging ? 3 : 0,
                                  border: "1px solid #f1f5f9",
                                  bgcolor: "white",
                                  ...provided.draggableProps.style // Necessary for drag physics
                                }}
                              >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                  <Box display="flex" gap={1} mb={1.5}>
                                    {lead.budget > 50000 && (
                                        <Chip label="High Value" size="small" sx={{ height: 20, fontSize: 10, bgcolor: "#dcfce7", color: "#166534", fontWeight: "bold" }} />
                                    )}
                                    <Chip label={lead.serviceType} size="small" sx={{ height: 20, fontSize: 10, bgcolor: "#f1f5f9" }} />
                                  </Box>
                                  <Typography fontWeight="700" sx={{ color: "#334155" }}>{lead.name}</Typography>
                                  <Box display="flex" alignItems="center" gap={1} mt={1} color="#64748b">
                                     <PhoneIcon sx={{ fontSize: 14 }} />
                                     <Typography variant="caption">{lead.phone}</Typography>
                                  </Box>
                                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                                  <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#0f172a", display: 'flex', alignItems: 'center' }}>
                                        <AttachMoneyIcon sx={{ fontSize: 16 }} /> {lead.budget.toLocaleString()}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Box>
    </Box>
  );
}