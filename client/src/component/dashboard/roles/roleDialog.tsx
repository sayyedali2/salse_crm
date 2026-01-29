"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { useNotification } from "@/context/NotificationContext";
import {
  CREATE_ROLE,
  UPDATE_ROLE,
  GET_ROLES,
} from "@/app/graphQL/Role.graphQl";
import { PERMISSION_GROUPS } from "@/constants/permissions";
import { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const roleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  roleData?: {
    _id: string;
    name: string;
    permissions: string[];
  } | null;
}

export default function RoleDialog({ open, onClose, roleData }: RoleDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { notify } = useNotification();

  const [createRole, { loading: creating }] = useMutation(CREATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
  });

  const [updateRole, { loading: updating }] = useMutation(UPDATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
  });

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", permissions: [] as string[] },
  });

  const selectedPermissions = watch("permissions");

  useEffect(() => {
    if (roleData) {
      setValue("name", roleData.name);
      setValue("permissions", roleData.permissions);
    } else {
      reset({ name: "", permissions: [] });
    }
  }, [roleData, open, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (roleData) {
        await updateRole({ variables: { input: { _id: roleData._id, name: data.name, permissions: data.permissions } } });
        notify("Role updated successfully", "success");
      } else {
        await createRole({ variables: { input: { name: data.name, permissions: data.permissions } } });
        notify("Role created successfully", "success");
      }
      onClose();
    } catch (error: any) {
      notify(error.message || "Something went wrong", "error");
    }
  };

  const handleSelectAll = (categoryItems: any[]) => {
    const categoryValues = categoryItems.map((i) => i.value);
    const allSelected = categoryValues.every((val) => selectedPermissions.includes(val));
    let newPermissions = [...selectedPermissions];
    if (allSelected) {
      newPermissions = newPermissions.filter((p) => !categoryValues.includes(p));
    } else {
      const toAdd = categoryValues.filter((val) => !selectedPermissions.includes(val));
      newPermissions = [...newPermissions, ...toAdd];
    }
    setValue("permissions", newPermissions);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      fullScreen={fullScreen}
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : 3 }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 800, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: { xs: 2, sm: 3 }
      }}>
        {roleData ? "Update Access Role" : "New Security Role"}
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <Stack spacing={4}>
            {/* Input Section */}
            <Box>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role Label (e.g. Sales Manager)"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5) }}
                  />
                )}
              />
            </Box>

            {/* Permissions Header */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Role Permissions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Grant specific access rights for this role
                  </Typography>
                </Box>
                <Chip 
                  label={`${selectedPermissions.length} selected`} 
                  color="primary" 
                  size="small" 
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
              {errors.permissions && (
                <Typography color="error" variant="caption">{errors.permissions.message}</Typography>
              )}
            </Box>

            {/* Grid Sections */}
            <Grid container spacing={2}>
              {PERMISSION_GROUPS.map((group) => {
                const groupValues = group.items.map((i) => i.value);
                const isAllSelected = groupValues.every((val) => selectedPermissions.includes(val));
                
                return (
                  <Grid size={{xs: 12, sm: 6}} key={group.category}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        borderRadius: 2,
                        borderColor: isAllSelected ? theme.palette.primary.main : 'divider',
                        bgcolor: isAllSelected ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                        transition: '0.2s'
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                        <Typography variant="subtitle2" fontWeight={800} color="primary">
                          {group.category}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => handleSelectAll(group.items)}
                          sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                        >
                          {isAllSelected ? "Clear" : "All"}
                        </Button>
                      </Stack>
                      <Divider sx={{ mb: 1.5 }} />
                      <Stack spacing={0.5}>
                        {group.items.map((item) => (
                          <Controller
                            key={item.value}
                            name="permissions"
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item.value)}
                                    onChange={(e) => {
                                      const newVal = e.target.checked 
                                        ? [...field.value, item.value]
                                        : field.value.filter((v: string) => v !== item.value);
                                      field.onChange(newVal);
                                    }}
                                    size="small"
                                  />
                                }
                                label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{item.label}</Typography>}
                                sx={{ m: 0 }}
                              />
                            )}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 },  }}>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={creating || updating}
            sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 700 }}
          >
            {creating || updating ? "Saving..." : (roleData ? "Update Role" : "Create Role")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}