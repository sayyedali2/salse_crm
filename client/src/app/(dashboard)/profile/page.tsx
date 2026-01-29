"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Stack,
  useTheme,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
  alpha,
  Chip,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import {
  Save,
  Person,
  Phone,
  Email,
  Business,
  AdminPanelSettings,
  Fingerprint,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNotification } from "@/context/NotificationContext";

// --- GraphQL ---
const GET_ME = gql`
  query FindMe {
    findMe {
      _id
      name
      email
      phone
      avatar
      status
      role {
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!, $userId: String!) {
    updateUser(input: $input, userId: $userId) {
      _id
      name
      phone
    }
  }
`;
interface UserData{
    findMe:{
        _id:string;
        name:string;
        email:string;
        phone:string;
        avatar:string;
        status:string;
        role:{
            name:string;
        }
    }
}

interface ProfileFormData {
  name: string;
  phone: string;
}

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {notify} = useNotification();
  const { data, loading, error, refetch } = useQuery<UserData>(GET_ME);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (data?.findMe) {
      reset({
        name: data.findMe.name,
        phone: data.findMe.phone || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      await updateUser({
        variables: {
          input: { name: formData.name, phone: formData.phone },
          userId: data?.findMe._id,
        },
      });
      notify('Profile Updated successfully');
      refetch();
    } catch (err: any) {
      notify(err.message);
    }
  };

  const user = data?.findMe;

  if (loading)
    return (
      <Box sx={{ height: "80vh", display: "grid", placeItems: "center" }}>
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );

  // --- STYLE CORRECTIONS (COLOR ONLY) ---
  
  // 1. Card Style: Use theme.background.paper (Glassy) directly
  const cardStyle = {
    borderRadius: 3,
    bgcolor: 'background.paper', // Uses rgba(255,255,255, 0.05) from your theme
    border: `1px solid ${theme.palette.divider}`, // Uses theme border
    backdropFilter: "blur(12px)",
    overflow: "hidden",
    boxShadow: theme.shadows[1], // Subtle shadow
  };

  // 2. Header Gradient: Keep it transparent/subtle to match Monotone theme
  const headerGradient = theme.palette.mode === 'dark'
    ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.05)} 0%, transparent 100%)`
    : `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.02)} 0%, transparent 100%)`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default", // #000000 from theme
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{ letterSpacing: -0.5, color: 'text.primary' }}
            >
              My Profile
            </Typography>
          </Box>
          <Button
            variant="contained"
            disabled={!isDirty || updating}
            onClick={handleSubmit(onSubmit)}
            startIcon={
              updating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Save />
              )
            }
            fullWidth={isMobile}
            sx={{ px: 3, fontWeight: "bold", borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* --- LEFT COLUMN: IDENTITY CARD --- */}
          <Grid size={{xs:12,md:12,lg:12}}>
            <Paper
              elevation={0}
              sx={{
                ...cardStyle,
                position: { xs: "static", md: "sticky" },
                top: 20,
                zIndex: 10,
              }}
            >
              {/* Cover Area - Monotone Gradient */}
              <Box
                sx={{
                  height: 100,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)' // Dark Grey to Black
                    : `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[300]} 100%)`,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              />

              <Box sx={{ px: 3, mt: -6, textAlign: "center" }}>
                <Avatar
                  src={user?.avatar || ""}
                  variant="rounded"
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    bgcolor: "text.primary", // White Avatar bg in Dark Mode
                    color: "background.default", // Black Text
                    border: `4px solid ${theme.palette.background.default}`, // Matches page bg
                    boxShadow: theme.shadows[3],
                    borderRadius: "50%",
                    mx: "auto",
                
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>

                <Box mt={2} mb={3}>
                  <Typography variant="h6" fontWeight="800" color="text.primary">
                    {user?.name}
                  </Typography>
                  <Chip
                    label={user?.role?.name || "User"}
                    size="small"
                    // Change to default color to adhere to monotone theme
                    color="default" 
                    variant="outlined"
                    sx={{
                      mt: 0.5,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      height: 24,
                      textTransform: "uppercase",
                      borderColor: 'divider',
                      color: 'text.secondary'
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Meta Details List */}
                <Stack spacing={2} sx={{ textAlign: "left", pb: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.text.primary, 0.05), // Theme based opacity
                      }}
                    >
                      <Email color="inherit" sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Box>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        EMAIL
                      </Typography>
                      <Typography variant="body2" color="text.primary" noWrap title={user?.email}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                      }}
                    >
                      <Business color="inherit" sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        ORGANIZATION
                      </Typography>
                      <Typography variant="body2" color="text.primary">Websenor Agency</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* --- RIGHT COLUMN: EDITABLE DETAILS --- */}
          <Grid size={{xs:12,md:12,lg:12}}>

            <Paper elevation={0} sx={cardStyle}>
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  background: headerGradient,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  General Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal details visible in the system.
                </Typography>
              </Box>

              {/* Form Content */}
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Grid container spacing={4}>
                  <Grid size={{xs:12,md:6}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      {...register("name", { required: true })}
                      placeholder="Enter your name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        // Removing manual BG/Border here so it uses your Theme's MuiOutlinedInput style
                      }}
                    />
                  </Grid>

                  <Grid size={{xs:12,md:6}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      {...register("phone")}
                      placeholder="+91..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{xs:12}}>
                    <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  </Grid>

                  <Grid size={{xs:12,md:6}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      disabled
                      value={user?.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              // Ensure this green pops on black
                              bgcolor: "#4ade80", 
                              borderRadius: "50%",
                              mr: 1,
                              boxShadow: '0 0 10px #4ade80'
                            }}
                          />
                        ),
                        sx: {
                          // Allow theme input style, but adjust opacity for disabled state visibility
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: theme.palette.text.primary,
                            opacity: 0.7
                          },
                        },
                      }}
                      helperText="Contact admin to change email."
                    />
                  </Grid>

                  <Grid size={{xs:12,md:6}}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Role Permission
                    </Typography>
                    <TextField
                      fullWidth
                      value={user?.role?.name}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminPanelSettings fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                         sx: {
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: theme.palette.text.primary,
                            opacity: 0.7
                          },
                        },
                      }}
                      helperText="Roles are managed by organization policy."
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}