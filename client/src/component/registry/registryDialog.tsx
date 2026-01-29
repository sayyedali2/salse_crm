"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Link,
  Grid,
  TextField,
  Typography,
  useTheme,
  alpha,
  Paper,
  IconButton,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppRegistration,
  Business,
  Email,
  Fullscreen,
  Language,
  Lock,
  Person,
  Phone,
} from "@mui/icons-material";
import ThemeSwitcher from "@/component/ThemeSwitcher";
import { useNotification } from "@/context/NotificationContext";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    ownerPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    domain: z.string().min(3, "Domain must be at least 3 characters long"),
    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
      .optional(),
    phone: z.coerce.string().min(10, "Invalid Number!!!"),
    ownerName: z
      .string()
      .min(3, "Owner name must be at least 3 characters long"),
    logoUrl: z.string().optional(),
  })
  .refine((data) => data.ownerPassword === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
interface FormData {
  email: string;
  name: string;
  ownerPassword: string;
  domain: string;
  confirm_password?: string;
  phone: string;
  ownerName: string;
  logoUrl?: string;
}

const registerMutation = gql`
  mutation Register($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      accessToken
      user {
        name
        email
        phone
        role {
          _id
          name
        }
        status
        avatar
      }
    }
  }
`;

interface RegisterResponse {
  createOrganization: {
    accessToken: string;
    user: {
      name: string;
      email: string;
      phone: string;
      role: {
        _id: string;
        name: string;
      };
      status: string;
      avatar: string;
    };
  };
}

interface RegisterVariables {
  input: {
    name: string;
    email: string;
    ownerPassword: string;
    domain: string;
    phone: string;
    ownerName: string;
    logoUrl?: string;
  };
}

export default function Register({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { notify } = useNotification();
  const theme = useTheme();
  const [createOrganization] = useMutation<RegisterResponse, RegisterVariables>(
    registerMutation,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      ownerName: "",
      confirm_password: "",
      ownerPassword: "",
      domain: "",
      logoUrl: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const { confirm_password, ...payload } = data;
      const res = await createOrganization({ variables: { input: payload } });

      if (res.data?.createOrganization?.accessToken) {
        localStorage.setItem(
          "accessToken",
          res.data.createOrganization.accessToken,
        );
      }

      reset(); // ✅ ab reset hoga
      notify("Organization Created Successfully!!!");
      router.push("/overview");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "Something went wrong!!!";

      if (errorMessage.includes("E11000 duplicate key")) {
        if (errorMessage.includes("email")) {
          notify("Email already exists. Please use a different email.");
        } else if (errorMessage.includes("domain")) {
          notify("Domain already exists. Please use a different domain.");
        } else {
          notify("This record already exists.");
        }
      } else {
        notify(errorMessage);
      }
    }
  };
  const textFieldSx = {
    mb: 2.5,
  };

  return (
    <>
      {/* Theme Switcher Button */}
      <Box position="absolute" top={20} right={20} zIndex={1301}>
        <ThemeSwitcher />
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        disableScrollLock
        PaperProps={
          {
            component: "div",
            "data-lenis-prevent": true,
            sx: {
              // 'background.default' auto-switch karega dark/light ke hisaab se
              bgcolor: "background.paper",
              color: "text.primary",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow: theme.shadows[10], // MUI shadow use kiya
              backgroundImage: "none",
            },
          } as any
        }
      >
        <IconButton
          onClick={() => {
            setOpen(false);
            router.push("/");
          }}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            height: "40px",
            width: "40px",
            position: "absolute",
            top: 10,
            right: 10,
            margin: 3,
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* Header */}
        <DialogTitle sx={{ textAlign: "center", py: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1.5}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "12px",
                // Primary color ka 10% opacity version
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
              }}
            >
              <AppRegistration sx={{ fontSize: 32, color: "primary.main" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ letterSpacing: "0.5px" }}
            >
              Register Your Business
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your company profile to get started
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Organization Details Section */}
              <Grid size={{ xs: 12, md: 10 }}>
                <Paper
                  sx={{
                    p: 3,
                    // Card background ab dynamic hai ('background.paper')

                    borderRadius: 3,
                    height: "85%",
                    width: "100%",
                    // Border color theme ke divider se match karega
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 3,
                      color: "primary.main",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Business fontSize="small" /> Organization
                  </Typography>

                  <TextField
                    fullWidth
                    label="Name"
                    placeholder="Company Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Domain"
                    placeholder="website.com"
                    {...register("domain")}
                    error={!!errors.domain}
                    helperText={errors.domain?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Logo URL"
                    placeholder="https://..."
                    {...register("logoUrl")}
                    error={!!errors.logoUrl}
                    helperText={errors.logoUrl?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Link fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Paper>
              </Grid>

              {/* Owner Details Section */}
              <Grid size={{ xs: 12, md: 10 }}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    height: "85%",
                    border: 1,
                    width: "100%",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 3,
                      color: "primary.main",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Person fontSize="small" /> Owner Details
                  </Typography>

                  <TextField
                    fullWidth
                    label="Owner Name"
                    placeholder="Owner Name"
                    {...register("ownerName")}
                    error={!!errors.ownerName}
                    helperText={errors.ownerName?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="Owner Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone"
                    placeholder="Owenr Phone Number"
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message as string}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Password"
                        placeholder="Password"
                        type="password"
                        {...register("ownerPassword")}
                        error={!!errors.ownerPassword}
                        helperText={errors.ownerPassword?.message as string}
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Confirm"
                        placeholder="ConfirmPassword"
                        type="password"
                        {...register("confirm_password")}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message as string}
                        sx={textFieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{ p: 4, pt: 2, justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              sx={{
                fontWeight: "bold",
                px: 5,
                py: 1,
                boxShadow: 4, // MUI Shadow
              }}
            >
              Register Business
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
