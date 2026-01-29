"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Add, Delete, Edit, Security } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ROLES, DELETE_ROLE } from "@/app/graphQL/Role.graphQl";
import Loader from "@/component/loding";
import RoleDialog from "@/component/dashboard/roles/roleDialog";
import { useNotification } from "@/context/NotificationContext";
import DeleteConfirmDialog from "@/component/DeleteConfirmDialog";

// --- Interfaces ---
interface Role {
  _id: string;
  name: string;
  permissions: string[];
  isSystemRole: boolean;
}

interface GetRolesData {
  getRoles: Role[];
}

export default function RolesPage() {
  const theme = useTheme();
  const { notify } = useNotification();

  // --- State Management ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: "",
    name: "",
  });

  // --- Apollo Hooks ---
  const { data, loading, error } = useQuery<GetRolesData>(GET_ROLES);
  
  const [deleteRole] = useMutation(DELETE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    onCompleted: () => notify("Role deleted successfully", "success"),
    onError: (err) => notify(err.message || "Failed to delete role", "error"),
  });

  // --- Handlers ---
  const handleCreate = () => {
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const confirmDelete = async () => {
    await deleteRole({ variables: { roleID: deleteDialog.id } });
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  if (loading) return <Loader message="Fetching Roles..." />;
  
  if (error) return (
    <Box p={4} textAlign="center">
      <Typography color="error" variant="h6">Error: {error.message}</Typography>
    </Box>
  );

  const roles = data?.getRoles || [];

  return (
    <Box sx={{ width: "100%", minHeight: "100%", bgcolor: "transparent", p: { xs: 1, sm: 2 } }}>
      
      {/* HEADER SECTION */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={3}
        mb={4}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              display: "flex",
            }}
          >
            <Security sx={{ fontSize: { xs: 24, sm: 32 } }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
              Roles & Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Manage user access levels and system authorities.
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        //   fullWidth={theme.breakpoints.down('sm') ? true : false} // Mobile par full width button
          disableElevation
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            py: 1.2, 
            fontWeight: 700,
            textTransform: "none",
            alignSelf: { xs: "stretch", sm: "auto" }
          }}
        >
          Add New Role
        </Button>
      </Stack>

      {/* TABLE SECTION */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 3,
          bgcolor: "background.paper",
          borderColor: "divider",
          overflowX: "auto", // Mobile par scroll enable karne ke liye
        }}
      >
        <Table sx={{ minWidth: 650 }}> {/* Kam se kam width taaki scrollbar dikhe mobile par */}
          <TableHead 
            sx={{ 
              bgcolor: alpha(theme.palette.text.primary, 0.02),
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>ROLE NAME</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>PERMISSIONS</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}>TYPE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 2, width: 120 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow 
                  key={role._id} 
                  hover 
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography fontWeight={700} color="text.primary" variant="body2">
                      {role.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${role.permissions.length} Scopes`}
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: "info.main",
                        border: "none"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.isSystemRole ? "System Default" : "Custom"}
                      size="small"
                      variant={role.isSystemRole ? "filled" : "outlined"}
                      color={role.isSystemRole ? "primary" : "default"}
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: "0.6rem",
                        borderRadius: 1,
                        textTransform: "uppercase"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit Permissions">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(role)}
                          disabled={role.name === "Owner"}
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: "primary.main",
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Role">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(role._id, role.name)}
                          disabled={role.isSystemRole}
                          sx={{ 
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            color: "error.main",
                            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.15) }
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No roles found in the system.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- MODALS & DIALOGS --- */}
      
      <RoleDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        roleData={selectedRole}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        onConfirm={confirmDelete}
        title="Delete Access Role?"
        description="This action is permanent. Any user currently assigned to this role may experience access issues."
        itemName={deleteDialog.name}
      />
    </Box>
  );
}