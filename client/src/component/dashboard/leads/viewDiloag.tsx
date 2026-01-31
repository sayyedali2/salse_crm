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
import { useMutation } from "@apollo/client/react";
import { LeadsData } from "@/app/(dashboard)/leads/page";
import { gql } from "@apollo/client";
import { useNotification } from "@/context/NotificationContext";
import { useForm, Controller } from "react-hook-form";
import AgentSearchAutocomplete from "@/component/autocomplete/teamMember.autocomplete";
import { SERVICE_TYPES } from "@/constants/common";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "REJECTED",
];

const DELETE_LEAD = gql`
  mutation DeleteLead($id: String!) {
    deleteLead(id: $id)
  }
`;

const UPDATE_LEAD = gql`
  mutation UpdateLead($id: String!, $data: UpdateLeadInput!) {
    UpdateLead(id: $id, data: $data) {
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

const ASSIGN_LEAD = gql`
  mutation SingleLeadAssignment($leadId: String!, $userId: String!) {
    singleLeadAssignment(leadId: $leadId, userId: $userId) {
      _id
      assignedTo {
        _id
        name
      }
    }
  }
`;

// const GET_USERS = gql`
// query GetUsers{
// }`

interface LeadDialog {
  open: boolean;
  onClose: () => void;
  lead: LeadsData | null;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  budget?: number;
  serviceType?: string;
}

export default function ViewDialog(lead: LeadDialog) {
  const [deleteLeadMutation] = useMutation(DELETE_LEAD);
  const [updateLeadMutation] = useMutation(UPDATE_LEAD);
  const [sendProposal] = useMutation(gql`
    mutation SendProposal($id: String!) {
      sendProposal(id: $id)
    }
  `);
  const { notify } = useNotification();
  const theme = useTheme();

  const [assignLead] = useMutation(ASSIGN_LEAD);

  // Responsive Check: sm (600px) se neeche fullscreen ho jayega
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const electricBlue = "#00f3ff";
  const [isEditing, setIsEditing] = useState(false);

  const { handleSubmit, reset, control } = useForm<LeadsData>({
    defaultValues: lead.lead || {},
  });

  useEffect(() => {
    if (lead.lead) {
      reset(lead.lead);
    }
  }, [lead.lead, reset]);

  const handleDelete = async () => {
    try {
      await deleteLeadMutation({
        variables: { id: lead.lead?._id.toString() },
      });
      notify("Lead deleted successfully!", "success");
      lead.onClose();
    } catch (error: any) {
      notify("Failed to delete lead", error.message);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    lead.onClose();
  };

  const handleSendProposal = async () => {
    if (!lead.lead?._id) return;
    try {
      await sendProposal({
        variables: { id: lead.lead._id.toString() },
      });
      notify("Proposal sent successfully!", "success");
      lead.onClose();
    } catch (error: any) {
      notify("Failed to send proposal", error.message);
    }
  };

  const handleUpdate = async (data: LeadsData) => {
    try {
      const updatePayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        budget: Number(data.budget),
        serviceType: data.serviceType,
      };

      await updateLeadMutation({
        variables: {
          id: lead.lead?._id.toString(),
          data: updatePayload,
        },
      });
      notify("Lead updated successfully!", "success");
      setIsEditing(false);
      lead.onClose();
    } catch (error: any) {
      notify("Failed to update lead", error.message);
    }
  };

  const renderField = (
    label: string,
    fieldName: keyof LeadsData,
    icon: React.ReactNode,
    type: string = "text",
    options?: string[],
  ) => {
    // Logic for AssignedTo field
    const isAssignedField = fieldName === "assignedTo";
    const rawValue = lead.lead?.[fieldName];

    // Display value handling (Agar object hai toh .name dikhao)
    const displayValue = isAssignedField
      ? typeof rawValue === "object"
        ? (rawValue as any)?.name
        : rawValue
      : rawValue;

    return (
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            bgcolor: isEditing
              ? alpha(electricBlue, 0.02)
              : alpha(theme.palette.background.paper, 0.1),
            border: `1px solid ${isEditing ? alpha(electricBlue, 0.2) : theme.palette.divider}`,
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
                  fontSize: "0.65rem",
                  display: "block",
                }}
              >
                {label}
              </Typography>

              {isEditing ? (
                isAssignedField ? (
                  // YAHAN AUTOCOMPLETE INTEGRATE KIYA HAI
                  <AgentSearchAutocomplete
                    onSelect={async (id) => {
                      if (lead.lead?._id) {
                        try {
                          await assignLead({
                            variables: {
                              leadId: lead.lead._id.toString(),
                              userId: id,
                            },
                          });
                          notify("Lead reassigned successfully!", "success");
                        } catch (err: any) {
                          notify("Reassignment failed", err.message);
                        }
                      }
                    }}
                  />
                ) : (
                  // Normal fields ke liye purana Controller logic
                  <Controller
                    name={fieldName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="standard"
                        type={type}
                        select={!!options}
                        value={field.value ?? ""}
                        sx={{ mt: 0.5 }}
                      >
                        {options?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                )
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.2 }}>
                  {displayValue || "—"}
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
      open={lead.open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile} // Mobile par fullscreen
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 6,
          backgroundImage: "none",
          bgcolor: theme.palette.background.default,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={900}
            letterSpacing={-1}
          >
            LEAD <span style={{ color: electricBlue }}>INFO</span>
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            ID: {lead.lead?._id || "LAD-9921"}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
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
                <Edit fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton onClick={handleClose}>
                <Close fontSize={isMobile ? "small" : "medium"} />
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
          {renderField(
            "Current Status",
            "status",
            <BarChart fontSize="small" />,
            "text",
            LEAD_STATUSES,
          )}
          {renderField(
            "Assigned Agent",
            "assignedTo",
            <AssignmentInd fontSize="small" />,
          )}
          {renderField("Lead Source", "source", <Language fontSize="small" />)}
          {renderField(
            "Estimated Budget",
            "budget",
            <Payments fontSize="small" />,
            "number",
          )}
          {renderField(
            "Service Interest",
            "serviceType",
            <Settings fontSize="small" />,
            "text",
            SERVICE_TYPES,
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 3 } }}>
        {isEditing ? (
          <Stack
            direction={isMobile ? "column" : "row"}
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
                color: "#000",
                order: { xs: 1, sm: 2 },
                "&:hover": { bgcolor: "#00f3ff" },
              }}
            >
              Update Lead
            </Button>
          </Stack>
        ) : (
          <>
            <Button
              onClick={handleSendProposal}
              sx={{
                mr: 2,
                color: electricBlue,
                borderColor: electricBlue,
                fontWeight: 800,
                "&:hover": { bgcolor: alpha(electricBlue, 0.1) },
              }}
              variant="outlined"
            >
              Send Proposal
            </Button>
            <Button
              onClick={handleDelete}
              fullWidth={isMobile}
              variant="contained"
              sx={{
                bgcolor: theme.palette.error.main,
                color: "#fff",
                borderRadius: 3,
                px: 6,
                py: 1.5,
                fontWeight: 800,
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.8) },
              }}
            >
              Delete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
