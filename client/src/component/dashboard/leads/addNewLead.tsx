"use client";

import { SERVICE_TYPES } from "@/constants/common";
import { LeadsData } from "@/app/(dashboard)/leads/page";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNotification } from "@/context/NotificationContext";
import AgentSearchAutocomplete from "@/component/autocomplete/teamMember.autocomplete";
import { useState } from "react";

const ADD_LEAD = gql`
  mutation CreateLead(
    $createLeadInput: CreateLeadInput!
    $manualUserId: String
  ) {
    createLead(createLeadInput: $createLeadInput, manualUserId: $manualUserId) {
      _id
      name
      email
      phone
      status
      budget
      serviceType
    }
  }
`;

const GET_MY_PERMISSIONS = gql`
  query GetMyPermissions {
    findMe {
      role {
        permissions
      }
    }
  }
`;

interface GetPermissionsQuery {
  findMe: {
    role: {
      permissions: string[];
    };
  };
}

export default function AddNewLead({
  open,
  setOpen,
  onLeadAdded,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLeadAdded?: () => void;
}) {
  const { notify } = useNotification();
  const [createLead, { loading }] = useMutation(ADD_LEAD);
  const { data: userData } = useQuery<GetPermissionsQuery>(GET_MY_PERMISSIONS);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);

  const permissions = userData?.findMe?.role?.permissions || [];
  const canAssign = permissions.includes("leads.assign");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadsData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: undefined,
      serviceType: "",
    },
  });

  const handleClose = () => {
    reset();
    setAssignedUserId(null); // Reset assignment
    setOpen(false);
  };

  const onSubmit = async (data: LeadsData) => {
    try {
      const budgetNumber = Number(data.budget);
      await createLead({
        variables: {
          createLeadInput: { ...data, budget: budgetNumber },
          manualUserId: assignedUserId, // Pass selected user ID
        },
      });
      notify("Lead created successfully!");
      reset();
      handleClose();
      if (onLeadAdded) {
        onLeadAdded();
      }
    } catch (error: any) {
      notify("Failed to create lead", error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      {/* Custom Header */}
      <DialogTitle
        sx={{ m: 0, p: 3, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <PersonAddIcon fontSize="small" color="primary" />
        <Typography variant="h6" component="span">
          Add New Lead
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to register a new lead in your pipeline.
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            placeholder="e.g. John Doe"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Phone"
              placeholder="+1 234..."
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              fullWidth
              label="Budget"
              type="number"
              placeholder="0.00"
              {...register("budget", { required: "Budget is required" })}
              error={!!errors.budget}
              helperText={errors.budget?.message}
            />
          </Stack>

          <TextField
            fullWidth
            select
            label="Service Type"
            placeholder="Select Service Type"
            {...register("serviceType")}
            error={!!errors.serviceType}
            helperText={errors.serviceType?.message}
          >
            {SERVICE_TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Assign Agent Section - Only for Authorized Users */}
          {canAssign && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Assign Agent (Optional)
              </Typography>
              <AgentSearchAutocomplete
                onSelect={(id) => setAssignedUserId(id)}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Lead"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
