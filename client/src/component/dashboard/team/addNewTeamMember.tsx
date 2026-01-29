"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNotification } from "@/context/NotificationContext";

// ... (Queries and Interfaces remain the same)
const ADD_TEAM_MEMBER = gql`
  mutation CreateLead($createAdminUserInput: CreateAdminUserInput!) {
    createAdminUser(input: $createAdminUserInput) {
      _id
      name
      email
      phone
      role { _id }
      status
      avatar
    }
  }
`;

const ROLES = gql`
  query GetRoles {
    getRoles {
      _id
      name
    }
  }
`;

interface CreateAdminUserInput {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Role {
  _id: string;
  name: string;
}

interface RolesData {
  getRoles: Role[];
}

export default function AddNewTeamMember({
  open,
  setOpen,
  onLeadAdded,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLeadAdded?: () => void;
}) {
  const theme = useTheme();
  const { notify } = useNotification();
  
  // Mobile par full screen karne ke liye logic
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [createLead, { loading }] = useMutation(ADD_TEAM_MEMBER);
  const { data, loading: roleLoading } = useQuery<RolesData>(ROLES);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminUserInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (formData: CreateAdminUserInput) => {
    try {
      await createLead({
        variables: {
          createAdminUserInput: { ...formData },
        },
      });
      notify("Team member created successfully!");
      handleClose();
      if (onLeadAdded) onLeadAdded();
    } catch (error: any) {
      notify(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen} // Responsive Fullscreen
      scroll="paper"
    >
      {/* Header Section */}
      <DialogTitle
        sx={{
          m: 0,
          p: { xs: 2, sm: 3 }, // Mobile par kam padding
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: fullScreen ? `1px solid ${theme.palette.divider}` : "none",
        }}
      >
        <PersonAddIcon fontSize="small" color="primary" />
        <Typography variant="h6" component="span" sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          Add New Team Member
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 1, sm: 0 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to register a new team member in your pipeline.
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Flexible Layout: Mobile par column, Desktop par Row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              fullWidth
              label="Role"
              {...register("role", { required: "Role is required" })}
              error={!!errors.role}
              helperText={errors.role?.message}
              disabled={roleLoading}
            >
              {data?.getRoles?.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Phone"
              placeholder="+1 234..."
              {...register("phone")}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: 0,
          flexDirection: { xs: "column", sm: "row" }, // Mobile par button niche-upar
          gap: 1 
        }}
      >
        <Button 
          variant="outlined" 
          onClick={handleClose}
          fullWidth={fullScreen}
          sx={{ display: { xs: "flex", sm: "none" } }} // Mobile par cancel button dikhayen
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          fullWidth={fullScreen} // Mobile par full width button
          sx={{ minWidth: 150 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Team Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}