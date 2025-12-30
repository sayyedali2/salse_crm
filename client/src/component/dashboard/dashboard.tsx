"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  CssBaseline,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
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
  Menu,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Container,
  Grid,
} from "@mui/material";

// Icons
import {
  AttachMoney,
  PictureAsPdf,
  History,
  ViewList,
  MoreVert,
  Edit,
  TrendingUp,
  Group,
  Delete,
} from "@mui/icons-material";

// Charts
import {
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// ---Interfaces---
import { Lead } from "@/app/interface/Lead.interface";

// --- TYPES & GRAPHQL ---
import { GET_LEADS, DELETE_LEAD } from "@/app/graphQL/Lead.graphQl";
import { UPDATE_STATUS_MUTATION } from "@/app/graphQL/Status.graphQl";
import { SEND_PROPOSAL_MUTATION } from "@/app/graphQL/Proposal.graphQl";
import EditLeadModal from "@/component/dashboard/EditeForm";

interface GetLeadsData {
  leads: Lead[];
}

export default function Dashboard() {
  const { data, loading, refetch } = useQuery<GetLeadsData>(GET_LEADS);
  const [updateStatus] = useMutation(UPDATE_STATUS_MUTATION);
  const [deleteLead] = useMutation(DELETE_LEAD);
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
        if (
          ["NEW", "QUALIFIED", "PROPOSAL_SENT", "MEETING_BOOKED"].includes(
            lead.status
          )
        )
          active.push(lead);
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
      case "PROPOSAL_SENT":
        return { color: "#ff05deff", bg: "#fff2f2", label: "Proposal Sent" };
      case "REJECTED":
        return { color: "#dc2626", bg: "#fef2f2", label: "Rejected" };
      case "MEETING_BOOKED":
        return { color: "#464646ff", bg: "#fef2f2", label: "Rejected" };
      default:
        return { color: "grey", bg: "#f3f4f6", label: status };
    }
  };

  const STATUS_OPTIONS = [
    "NEW",
    "QUALIFIED",
    "WON",
    "PROPOSAL_SENT",
    "REJECTED",
    "MEETING_BOOKED",
  ];
  const Service_Type = ["Web Dev", "App Dev", "AI Automation"];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead({ variables: { id } });
      refetch();
      setToast({
        open: true,
        msg: "Lead deleted successfully",
        type: "success",
      });
      setSelectedLead(null);
    } catch (err) {
      setToast({ open: true, msg: "Failed to delete lead", type: "error" });
      setSelectedLead(null);
    }
  };
  const [menuLead, setMenuLead] = useState<Lead | null>(null);
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
                            <MenuItem value="NEW" sx={{ color: "#6366f1" }}>
                              New Inquiry
                            </MenuItem>
                            <MenuItem
                              value="QUALIFIED"
                              sx={{ color: "#d97706" }}
                            >
                              Qualified
                            </MenuItem>
                            <MenuItem
                              value="PROPOSAL_SENT"
                              sx={{ color: "#ff05deff" }}
                            >
                              Proposal Sent
                            </MenuItem>
                            <MenuItem
                              value="MEETING_BOOKED"
                              sx={{ color: "#464646ff" }}
                            >
                              Meeting Booked
                            </MenuItem>
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
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setMenuLead(lead);
                          }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => {
                            setAnchorEl(null);
                            setMenuLead(null);
                          }}
                        >
                          <MenuItem
                            onClick={(e) => {
                              if (!menuLead) return;
                              handleSendProposal(e, menuLead._id);
                              setAnchorEl(null);
                            }}
                          >
                            {proposalLoading === menuLead?._id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <PictureAsPdf
                                fontSize="small"
                                sx={{
                                  color: "#ef4444",
                                  bgcolor: "#fef2f2",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              />
                            )}
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              if (!menuLead) return;
                              setSelectedLead(menuLead);
                              setAnchorEl(null);
                            }}
                            sx={{
                              color: "#6366f1",
                              bgcolor: "#eef2ff",
                              "&:hover": { bgcolor: "#e0e7ff" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              if (!menuLead) return;
                              handleDeleteLead(menuLead._id);
                              setAnchorEl(null);
                            }}
                            sx={{
                              color: "#ff0000ff",
                              bgcolor: "#eef2ff",
                              "&:hover": { bgcolor: "#e0e7ff" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <EditLeadModal
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        STATUS_OPTIONS={STATUS_OPTIONS}
        Service_Type={Service_Type}
      />
    </Box>
  );
}
