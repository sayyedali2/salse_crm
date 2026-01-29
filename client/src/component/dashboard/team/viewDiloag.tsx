"use client";
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
} from "@mui/material";
import {
  Edit,
  Person,
  Email,
  Close,
  Phone,
  BarChart,
  AssignmentInd,
  Language,
  Payments,
  Settings,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { LeadsData } from "@/app/(dashboard)/leads/page";
import { gql } from "@apollo/client";
import { useNotification } from "@/context/NotificationContext";
import { useForm, Controller } from "react-hook-form";
import { TeamData } from "@/app/(dashboard)/team/page";

const DELETE_TEAM_MEMBER = gql`
  mutation DeleteTeamMember($userId: String!) {
    deleteUser(userId: $userId) {
      message
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

const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeamMember($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      _id
      name
      email
      phone
      role {
        _id
        name
      }
      activeLeadsCount
    }
  }
`;

interface Role {
  _id: string;
  name: string;
}

interface RolesData {
  getRoles: Role[];
}

interface TeamMemberDialog {
  open: boolean;
  onClose: () => void;
  user: TeamData | null;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  role?: string;
  activeLeadsCount?: number;
}
interface TeamFormValues {
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  activeLeadsCount: number;
}

export default function ViewDialog(team: TeamMemberDialog) {
  const [deleteTeamMemberMutation] = useMutation(DELETE_TEAM_MEMBER);
  const [updateTeamMemberMutation] = useMutation(UPDATE_TEAM_MEMBER);
  const { notify } = useNotification();
  const theme = useTheme();
  const electricBlue = "#00f3ff";
  const [isEditing, setIsEditing] = useState(false);
  const { data: rolesData, loading: roleLoading } = useQuery<RolesData>(ROLES);

  // Responsive hook
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: team.user
      ? {
          name: team.user.name,
          email: team.user.email,
          phone: team.user.phone,
          status: team.user.status,
          activeLeadsCount: team.user.activeLeadsCount,
          role: team.user.role?._id || "",
        }
      : {},
  });

  useEffect(() => {
    if (team.user) {
      reset({
        name: team.user.name,
        email: team.user.email,
        phone: team.user.phone,
        status: team.user.status,
        activeLeadsCount: team.user.activeLeadsCount,
        role: team.user.role?._id || "",
      });
    }
  }, [team.user, reset]);

  // --- Original Functionality Maintained ---
  const handleDelete = async () => {
    try {
      await deleteTeamMemberMutation({
        variables: { userId: team.user?._id.toString() },
      });
      notify("Team member deleted successfully!", "success");
      team.onClose();
    } catch (error: any) {
      console.log(error);
      notify("Failed to delete team member", error.message);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    team.onClose();
  };

  const handleUpdate = async (data: TeamFormValues) => {
    try {
      const updatePayload: UpdateUserInput = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        activeLeadsCount: data.activeLeadsCount,
        role: data.role,
      };

      await updateTeamMemberMutation({
        variables: {
          userId: team.user?._id.toString(),
          input: updatePayload,
        },
      });
      notify("Team member updated successfully!", "success");
      reset();
      setIsEditing(false);
      team.onClose();
    } catch (error: any) {
      console.log(error);
      notify("Failed to update team member", error.message);
    }
  };

  const renderField = (
    label: string,
    fieldName: keyof TeamFormValues,
    icon: React.ReactNode,
    type: string = "text",
    options?: string[],
  ) => {
    const value = team.user?.[fieldName as keyof TeamData];

    return (
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 }, // Mobile padding adjusted
            borderRadius: 3,
            bgcolor: isEditing ? alpha(electricBlue, 0.02) : "transparent",
            border: `1px solid ${
              isEditing ? alpha(electricBlue, 0.2) : theme.palette.divider
            }`,
            transition: "0.3s",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                color: theme.palette.text.secondary,
                display: "flex",
              }}
            >
              {icon}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                }}
              >
                {label}
              </Typography>
              {isEditing ? (
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) =>
                    fieldName === "role" ? (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: false }}
                        sx={{ mt: 0.5 }}
                        value={field.value || ""} // Ensure value is handled
                      >
                        {roleLoading ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          rolesData?.getRoles.map((role) => (
                            <MenuItem key={role._id} value={role._id}>
                              {role.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    ) : (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="standard"
                        type={type}
                        value={field.value ?? ""}
                        InputProps={{ disableUnderline: false }}
                        sx={{ mt: 0.5 }}
                      />
                    )
                  }
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    mt: 0.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {typeof value === "object" && value !== null
                    ? (value as { name: string }).name
                    : (value as string) || "—"}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Grid>
    );
  };

  return (
    <Dialog
      open={team.open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen} // Responsive Full Screen
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 6,
          backgroundImage: "none",
          bgcolor: theme.palette.background.default,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", // For very small screens
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant={fullScreen ? "h5" : "h4"}
            fontWeight={900}
            letterSpacing={-1}
          >
            TEAM MEMBER <span style={{ color: electricBlue }}>INFO</span>
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            ID: {team.user?._id || "LAD-9921"}
          </Typography>
        </Box>

        <Box display={"flex"} gap={{ xs: 1, sm: 2 }}>
          {!isEditing && (
            <>
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{
                  bgcolor: alpha(electricBlue, 0.1),
                  color: electricBlue,
                  "&:hover": { bgcolor: alpha(electricBlue, 0.2) },
                }}
              >
                <Edit fontSize={fullScreen ? "small" : "medium"} />
              </IconButton>
              <IconButton
                onClick={() => {
                  isEditing && setIsEditing(false);
                  reset();
                  team.onClose();
                }}
              >
                <Close fontSize={fullScreen ? "small" : "medium"} />
              </IconButton>
            </>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: 0 }}>
        <Grid container spacing={2}>
          {renderField("Full Name", "name", <Person fontSize="small" />)}
          {renderField(
            "Email Address",
            "email",
            <Email fontSize="small" />,
            "email",
          )}
          {renderField("Phone Number", "phone", <Phone fontSize="small" />)}
          {renderField("Role", "role", <AssignmentInd fontSize="small" />)}
          {renderField(
            "Active Leads",
            "activeLeadsCount",
            <Person fontSize="small" />,
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 4 },
          mt: 2,
          flexDirection: isEditing && fullScreen ? "column" : "row",
          gap: 2,
        }}
      >
        {isEditing ? (
          <Stack
            direction={fullScreen ? "column" : "row"}
            spacing={2}
            width="100%"
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={() => setIsEditing(false)}
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 700,
                order: { xs: 2, sm: 1 },
              }}
            >
              Discard
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit(handleUpdate)}
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 800,
                bgcolor: electricBlue,
                "&:hover": { bgcolor: "#00f3ff" },
                order: { xs: 1, sm: 2 },
              }}
            >
              Update Team Member
            </Button>
          </Stack>
        ) : (
          <Button
            onClick={() => {
              handleDelete();
              team.onClose();
            }}
            fullWidth={fullScreen}
            disabled={team.user?.role?.name === "Owner"}
            variant="contained"
            sx={{
              bgcolor: theme.palette.error.main,
              color: theme.palette.background.default,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 800,
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.8) },
            }}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
