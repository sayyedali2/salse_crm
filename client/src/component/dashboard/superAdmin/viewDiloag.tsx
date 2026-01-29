import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  MenuItem,
  useMediaQuery,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Edit,
  Person,
  Email,
  Close,
  Phone,
  Domain,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNotification } from "@/context/NotificationContext";
import { useForm, Controller } from "react-hook-form";
import {
  CREATE_ORGANIZATION,
  DELETE_ORGANIZATION,
  GET_ORGANIZATION,
  OrganizationData,
} from "@/app/graphQL/Organization.graphQl";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form Schema
const orgSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  domain: z.string().min(3, "Domain is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  logoUrl: z.string().optional(),
  ownerPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

interface OrganizationDialog {
  open: boolean;
  onClose: () => void;
  user: OrganizationData | null;
}

export default function ViewDialog({
  open,
  onClose,
  user,
}: OrganizationDialog) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { notify } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  const [createOrganization, { loading: creating }] = useMutation(
    CREATE_ORGANIZATION,
    {
      refetchQueries: ["GetOrganization"], // Matches the query name in page.tsx
    },
  );

  const [deleteOrganization, { loading: deleting }] = useMutation(
    DELETE_ORGANIZATION,
    {
      refetchQueries: ["GetOrganization"],
    },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      domain: "",
      ownerName: "",
      logoUrl: "",
      ownerPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      setIsEditing(false); // Default to view mode for existing
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        domain: user.domain,
        ownerName: user.ownerName,
        logoUrl: user.logoUrl || "",
        ownerPassword: "", // Password not editable/viewable usually
      });
    } else {
      setIsEditing(true); // Create mode
      reset({
        name: "",
        email: "",
        phone: "",
        domain: "",
        ownerName: "",
        logoUrl: "",
        ownerPassword: "",
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (user) {
        // Edit logic (Not implemented in backend yet based on files seen, but keeping placeholder)
        notify("Update functionality not yet implemented", "info");
        setIsEditing(false);
      } else {
        // Create logic
        await createOrganization({
          variables: {
            input: {
              name: data.name,
              domain: data.domain,
              email: data.email,
              phone: data.phone,
              ownerName: data.ownerName,
              ownerPassword: data.ownerPassword,
              logoUrl: data.logoUrl,
            },
          },
        });
        notify("Organization created successfully", "success");
        onClose();
      }
    } catch (error: any) {
      notify(error.message || "Failed to save organization", "error");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteOrganization({ variables: { id: user._id } });
      notify("Organization deleted successfully", "success");
      onClose();
    } catch (error: any) {
      notify(error.message || "Failed to delete organization", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          bgcolor: theme.palette.background.default,
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {user ? "Organization Details" : "Create Organization"}
            </Typography>
            {user && (
              <Typography variant="caption" color="text.secondary">
                ID: {user._id}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Organization Name"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Domain color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="domain"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Domain"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.domain}
                    helperText={errors.domain?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.phone}
                    helperText={errors.phone?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Owner Name"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.ownerName}
                    helperText={errors.ownerName?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {!user && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="ownerPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Owner Password"
                      type="password"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.ownerPassword}
                      helperText={errors.ownerPassword?.message as string}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="logoUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Logo URL"
                    fullWidth
                    disabled={!isEditing}
                    error={!!errors.logoUrl}
                    helperText={errors.logoUrl?.message as string}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          {user && !isEditing ? (
            <>
              <Button color="error" onClick={handleDelete} disabled={deleting}>
                Delete Organization
              </Button>
              <Box flexGrow={1} />
              <Button onClick={() => onClose()}>Close</Button>
              {/* <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit
              </Button> */}
            </>
          ) : (
            <>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={creating}
                sx={{
                  bgcolor: "#00f3ff",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#00dbe6" },
                }}
              >
                {creating ? "Creating..." : "Create Organization"}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
