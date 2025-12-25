"use client";

import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  CssBaseline,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Container,
  Grid,
} from "@mui/material";

// Icons
import {
  AttachMoney,
  Phone,
  PictureAsPdf,
  Email,
  Close,
  History,
  ViewList,
  Edit,
  TrendingUp,
  Group,
  Assignment,
} from "@mui/icons-material";

// Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- TYPES & GRAPHQL ---
interface Lead {
  _id: string;
  name: string;
  budget: number;
  status: string;
  serviceType: string;
  phone: string;
  email: string;
}

interface GetLeadsData {
  leads: Lead[];
}

const GET_LEADS = gql`
  query GetLeads {
    leads {
      _id
      name
      budget
      status
      serviceType
      phone
      email
    }
  }
`;

const UPDATE_STATUS_MUTATION = gql`
  mutation UpdateStatus($id: String!, $status: String!) {
    updateLeadStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

const SEND_PROPOSAL_MUTATION = gql`
  mutation SendProposal($id: String!) {
    sendProposal(id: $id)
  }
`;

export default function DashboardPage() {
  const { data, loading, refetch } = useQuery<GetLeadsData>(GET_LEADS);
  const [updateStatus] = useMutation(UPDATE_STATUS_MUTATION);
  const [sendProposal] = useMutation(SEND_PROPOSAL_MUTATION);

  const [tabValue, setTabValue] = useState(0);
  const [activeLeads, setActiveLeads] = useState<Lead[]>([]);
  const [historyLeads, setHistoryLeads] = useState<Lead[]>([]);
  const [proposalLoading, setProposalLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Stats Logic
  const totalLeads = data?.leads.length || 0;
  const totalValue =
    data?.leads.reduce((acc, curr) => acc + curr.budget, 0) || 0;
  const activeCount = activeLeads.length;

  // Chart Data (Mock + Real Count Mix)
  const chartData = [
    { name: "Mon", leads: 2 },
    { name: "Tue", leads: 4 },
    { name: "Wed", leads: 1 },
    { name: "Thu", leads: 5 },
    { name: "Fri", leads: activeCount }, // Real active count
    { name: "Sat", leads: 3 },
    { name: "Sun", leads: 2 },
  ];

  useEffect(() => {
    if (data?.leads) {
      const active: Lead[] = [];
      const history: Lead[] = [];
      data.leads.forEach((lead: Lead) => {
        if (["NEW", "QUALIFIED"].includes(lead.status)) active.push(lead);
        else history.push(lead);
      });
      setActiveLeads(active);
      setHistoryLeads(history);
    }
  }, [data]);

  const handleStatusChange = async (id: string, event: SelectChangeEvent) => {
    const newStatus = event.target.value as string;
    // ... (Same logic as before) ...
    try {
      await updateStatus({ variables: { id, status: newStatus } });
      setToast({ open: true, msg: `Status updated`, type: "success" });
      refetch();
    } catch (err) {
      setToast({ open: true, msg: "Update failed", type: "error" });
    }
  };

  const handleSendProposal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProposalLoading(id);
    try {
      await sendProposal({ variables: { id } });
      setToast({
        open: true,
        msg: "Proposal Sent Successfully! 📄",
        type: "success",
      });
    } catch (err) {
      setToast({ open: true, msg: "Failed to send proposal.", type: "error" });
    } finally {
      setProposalLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return { color: "#6366f1", bg: "#eef2ff", label: "New Inquiry" };
      case "QUALIFIED":
        return { color: "#d97706", bg: "#fffbeb", label: "Qualified" };
      case "WON":
        return { color: "#059669", bg: "#ecfdf5", label: "Won" };
      case "REJECTED":
        return { color: "#dc2626", bg: "#fef2f2", label: "Rejected" };
      default:
        return { color: "grey", bg: "#f3f4f6", label: status };
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 8 }}>
      <CssBaseline />
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>

      {/* ✅ CONTAINER: Ye content ko center me rakhega aur side me chipakne se rokega */}
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontWeight="800" color="#1e293b">
              Dashboard
            </Typography>
            <Typography variant="body2" color="#64748b">
              Overview of your sales pipeline
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "#4f46e5" }}>A</Avatar>
        </Box>

        {/* --- ANALYTICS SECTION --- */}
        <Grid container spacing={3} mb={4}>
          {/* Stat Card 1: Total Revenue */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
                sx={{ opacity: 0.8 }}
              >
                <AttachMoney />{" "}
                <Typography variant="subtitle2">
                  Total Pipeline Value
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                ₹{totalValue.toLocaleString()}
              </Typography>
              <Chip
                label="+12% growth"
                size="small"
                sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            </Paper>
          </Grid>

          {/* Stat Card 2: Active Leads */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
                color="#64748b"
              >
                <Group />{" "}
                <Typography variant="subtitle2">Active Leads</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="#1e293b">
                {activeCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Potential clients currently in pipeline
              </Typography>
            </Paper>
          </Grid>

          {/* Chart: Weekly Trend */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="#64748b"
                mb={2}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <TrendingUp fontSize="small" /> Weekly Volume
              </Typography>
              <Box height={120} width="100%">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorLeads"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorLeads)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* --- TABS & TABLE --- */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "transparent",
            borderBottom: 1,
            borderColor: "divider",
            mb: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<ViewList />}
              iconPosition="start"
              label={`Active Pipeline (${activeLeads.length})`}
            />
            <Tab
              icon={<History />}
              iconPosition="start"
              label={`History (${historyLeads.length})`}
            />
          </Tabs>
        </Paper>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ color: "#64748b", fontWeight: "bold" }}>
                  CLIENT DETAILS
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: "bold" }}>
                  SERVICE
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: "bold" }}>
                  BUDGET
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: "bold" }}>
                  STATUS
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#64748b", fontWeight: "bold" }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? activeLeads : historyLeads).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 6, color: "#94a3b8" }}
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                (tabValue === 0 ? activeLeads : historyLeads).map((lead) => (
                  <TableRow
                    key={lead._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: getStatusColor(lead.status).color,
                            width: 36,
                            height: 36,
                            fontSize: 14,
                          }}
                        >
                          {lead.name[0]}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="600" color="#1e293b">
                            {lead.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            {lead.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={lead.serviceType}
                        size="small"
                        sx={{ bgcolor: "#f1f5f9", fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="bold" color="#475569">
                        ₹{lead.budget.toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {tabValue === 0 ? (
                        <FormControl
                          size="small"
                          variant="standard"
                          sx={{ minWidth: 120 }}
                        >
                          <Select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead._id, e)}
                            disableUnderline
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              color: getStatusColor(lead.status).color,
                            }}
                          >
                            <MenuItem value="NEW">New Inquiry</MenuItem>
                            <MenuItem value="QUALIFIED">Qualified</MenuItem>
                            <MenuItem value="WON" sx={{ color: "#059669" }}>
                              Mark Won
                            </MenuItem>
                            <MenuItem
                              value="REJECTED"
                              sx={{ color: "#dc2626" }}
                            >
                              Mark Lost
                            </MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={getStatusColor(lead.status).label}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(lead.status).bg,
                            color: getStatusColor(lead.status).color,
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Tooltip title="Send Proposal">
                          <IconButton
                            size="small"
                            onClick={(e) => handleSendProposal(e, lead._id)}
                            disabled={proposalLoading === lead._id}
                            sx={{
                              color: "#ef4444",
                              bgcolor: "#fef2f2",
                              "&:hover": { bgcolor: "#fee2e2" },
                            }}
                          >
                            {proposalLoading === lead._id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <PictureAsPdf fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedLead(lead)}
                            sx={{
                              color: "#6366f1",
                              bgcolor: "#eef2ff",
                              "&:hover": { bgcolor: "#e0e7ff" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* --- DETAIL MODAL --- */}
      <Dialog
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedLead && (
          <>
            <DialogTitle sx={{ borderBottom: "1px solid #f1f5f9" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  Lead Details
                </Typography>
                <IconButton onClick={() => setSelectedLead(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box
                    p={2}
                    bgcolor="#f8fafc"
                    borderRadius={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: "#eef2ff",
                        color: "#6366f1",
                      }}
                    >
                      {selectedLead.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedLead.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedLead.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography fontWeight="500">{selectedLead.phone}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">
                    Budget
                  </Typography>
                  <Typography fontWeight="500">
                    ₹{selectedLead.budget.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<PictureAsPdf />}
                onClick={(e) => handleSendProposal(e, selectedLead._id)}
                disabled={proposalLoading === selectedLead._id}
              >
                {proposalLoading === selectedLead._id
                  ? "Sending..."
                  : "Send Proposal PDF"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
