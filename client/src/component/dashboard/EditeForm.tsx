"use client";

import { useState } from "react";
import { UpdateLeadInput } from "@/app/interface/UpdateLeadInput.interface";
import { Lead } from "@/app/interface/Lead.interface";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Typography,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import {
  AttachMoney,
  Category,
  Close,
  Email,
  Flag,
  Person,
  Phone,
  Save,
} from "@mui/icons-material";
import { useMutation } from "@apollo/client/react";
import { UPDATE_LEAD } from "@/app/graphQL/Lead.graphQl";
import { useEffect } from "react";

interface EditFormProps {
  selectedLead: Lead | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  STATUS_OPTIONS: string[];
  Service_Type: string[];
}

const EditeForm: React.FC<EditFormProps> = ({
  selectedLead,
  setSelectedLead,
  STATUS_OPTIONS,
  Service_Type,
}) => {
  const [formData, setFormData] = useState<UpdateLeadInput>({
    name: "",
    email: "",
    phone: "",
    status: "",
    serviceType: "",
    budget: undefined,
  });

  useEffect(() => {
    if (selectedLead) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: selectedLead.name ?? "",
        email: selectedLead.email ?? "",
        phone: selectedLead.phone ?? "",
        status: selectedLead.status ?? "",
        serviceType: selectedLead.serviceType ?? "",
        budget: selectedLead.budget ?? undefined,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "",
        serviceType: "",
        budget: undefined,
      });
    }
  }, [selectedLead]);

  const PRIMARY_COLOR = "#6366F1"; // Indigo
  const PRIMARY_GRADIENT = "linear-gradient(135deg, #6366F1 0%, #4338ca 100%)";
  const ICON_BG = "#e0e7ff"; // Light Indigo for Icon background
  const [updateLead, { loading, error }] = useMutation(UPDATE_LEAD);

  const handleSave = async () => {
    if (!selectedLead) return;
    if (!formData.name || !formData.status) return;
    // API call (example)
    await updateLead({ variables: { id: selectedLead._id, data: formData } });

    setSelectedLead(null); // dialog close
  };

  return (
    <Dialog
      key={selectedLead?._id ?? "new"}
      open={Boolean(selectedLead)}
      onClose={() => setSelectedLead(null)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden", // Header radius match karne ke liye
        },
      }}
    >
      {/* COLORFUL HEADER SECTION */}

      <DialogTitle
        sx={{
          background: PRIMARY_GRADIENT, // Gradient Background
          color: "white",
          px: 3,
          py: 2.5,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" fontWeight="bold" letterSpacing={0.5}>
              Lead Details
            </Typography>
          </Box>
          <IconButton
            onClick={() => setSelectedLead(null)}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": {
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Form Content */}

      <DialogContent sx={{ pt: 4, pb: 2, px: 3, bgcolor: "#f8fafc" }}>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Name Field - Full Width */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* Colored Icon Box */}
                    <Box
                      sx={{
                        bgcolor: ICON_BG,
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: PRIMARY_COLOR,
                      }}
                    >
                      <Person fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
                m: 1,
              }} // White input background
            />
          </Grid>

          {/* Email - Half Width */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email Address"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        bgcolor: "#fee2e2", // Red tint for email
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: "#ef4444",
                      }}
                    >
                      <Email fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
              }}
            />
          </Grid>

          {/* Phone - Half Width */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        bgcolor: "#dcfce7", // Green tint for phone
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: "#22c55e",
                      }}
                    >
                      <Phone fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
              }}
            />
          </Grid>

          {/* Status - Half Width */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Lead Status"
              fullWidth
              select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        bgcolor: "#fef3c7", // Amber tint
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: "#f59e0b",
                      }}
                    >
                      <Flag fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Service Type - Half Width */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Service Type"
              fullWidth
              select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceType: e.target.value,
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        bgcolor: "#e0f2fe", // Sky blue tint
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: "#0ea5e9",
                      }}
                    >
                      <Category fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
              }}
            >
              {Service_Type.map((serviceType) => (
                <MenuItem key={serviceType} value={serviceType}>
                  {serviceType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Budget - Full Width */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <TextField
              label="Estimated Budget"
              type="number"
              fullWidth
              value={formData.budget}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        bgcolor: "#f3e8ff", // Purple tint
                        p: 0.8,
                        borderRadius: 2,
                        display: "flex",
                        color: "#9333ea",
                      }}
                    >
                      <AttachMoney fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "white" },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions Footer */}
      <DialogActions
        sx={{
          p: 3,
          bgcolor: "#f8fafc",
          justifyContent: "space-between", // Spread buttons for better look
        }}
      >
        <Button
          onClick={() => setSelectedLead(null)}
          variant="text"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          disabled={loading}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            background: PRIMARY_GRADIENT, // Matching Header Gradient
            boxShadow: "0px 4px 12px rgba(99, 102, 241, 0.4)", // Colored Shadow
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            },
          }}
        >
          Save Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditeForm;
