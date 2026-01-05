"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  GET_LEADS,
  DELETE_LEAD,
  LEAD_UPDATED_SUBSCRIPTION,
  LEAD_ADDED_SUBSCRIPTION,
  LEAD_DELETED_SUBSCRIPTION,
} from "@/app/graphQL/Lead.graphQl";
import { UPDATE_STATUS_MUTATION } from "@/app/graphQL/Status.graphQl";
import { SEND_PROPOSAL_MUTATION } from "@/app/graphQL/Proposal.graphQl";
import EditLeadModal from "@/component/dashboard/EditeForm";

interface GetLeadsData {
  leads: Lead[];
}

export default function Dashboard() {
  const { data, loading, subscribeToMore } = useQuery<GetLeadsData>(GET_LEADS, {
    fetchPolicy: "network-only", // Hamesha fresh data le
    nextFetchPolicy: "cache-first",
  });

  // --- 1. SUBSCRIPTION LOGIC ---
  useEffect(() => {
    // Lead Added
    const unsubAdded = subscribeToMore({
      document: LEAD_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }): GetLeadsData => {
        console.log("SUBSCRIPTION EVENT RECEIVED:", prev);
        console.log("SUBSCRIPTION EVENT RECEIVED:", subscriptionData);
        // 1. Check karein ki data aaya bhi hai ya nahi
        if (!subscriptionData.data) return prev as GetLeadsData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newLead = (subscriptionData.data as any).leadAdded;

        // 2. Safety: Agar prev data empty hai toh naya lead return karein
        if (!prev || !prev.leads) {
          return { leads: [newLead] } as GetLeadsData;
        }

        // 3. Duplicate check: Ensure karein ki ye lead list mein pehle se na ho
        const exists = prev.leads.some((l) => l?._id === newLead._id);
        if (exists) return prev as GetLeadsData;

        // 4. UI Update (Success Message)
        setToast({ open: true, msg: "New Lead Received! 🚀", type: "success" });

        // 5. YAHAN HAI FIX: Purani list ka copy banayein aur naya lead jodein
        return {
          ...prev,
          leads: [newLead, ...prev.leads],
        } as GetLeadsData;
      },
      onError: (err) => console.error("Subscription Error:", err),
    });
    // Lead Updated
    const unsubUpdate = subscribeToMore({
      document: LEAD_UPDATED_SUBSCRIPTION,

      updateQuery: (prev, { subscriptionData }): GetLeadsData => {
        // 1. Agar data nahi hai, toh purana data as it is return karo
        if (!subscriptionData.data) return prev as GetLeadsData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedLead = (subscriptionData.data as any).leadUpdated;

        // 2. Error throw karne ki jagah safely handle karein
        if (!prev || !prev.leads) {
          return { leads: [] } as GetLeadsData;
        }

        // 3. Map logic with Type Casting
        return {
          ...prev,
          leads: prev.leads.map((lead) =>
            lead?._id === updatedLead._id ? { ...lead, ...updatedLead } : lead
          ),
        } as GetLeadsData; // <--- Yeh casting zaroori hai
      },
      onError: (err) => console.error("Update Subscription Error:", err),
    });

    // Lead Deleted
    const unsubDeleted = subscribeToMore({
      document: LEAD_DELETED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }): GetLeadsData => {
        // 1. Data check aur type casting
        if (!subscriptionData.data) return prev as GetLeadsData;

        // Server se aane wali ID ko extract karein
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deletedData = (subscriptionData.data as any).leadDeleted;

        // Agar server object bhej raha hai { _id: "..." } ya sirf string "..."
        const idToCompare =
          typeof deletedData === "object" ? deletedData._id : deletedData;

        // 2. Safety check for leads array
        if (!prev || !prev.leads) return { leads: [] } as GetLeadsData;

        // 3. Filter logic with final Type Casting
        return {
          ...prev,
          leads: prev.leads.filter((lead) => lead?._id !== idToCompare),
        } as GetLeadsData;
      },
      onError: (err) => console.error("Delete Subscription Error:", err),
    });

    return () => {
      unsubAdded();
      unsubUpdate();
      unsubDeleted();
    };
  }, [subscribeToMore]);

  // --- 2. DERIVED STATES (No more extra UseEffects for sync) ---
  const { activeLeads, historyLeads, totalValue } = useMemo(() => {
    const leads = data?.leads || [];
    const active = leads.filter((l) =>
      ["NEW", "QUALIFIED", "PROPOSAL_SENT", "MEETING_BOOKED"].includes(l.status)
    );
    const history = leads.filter(
      (l) =>
        !["NEW", "QUALIFIED", "PROPOSAL_SENT", "MEETING_BOOKED"].includes(
          l.status
        )
    );
    const total = leads.reduce((acc, curr) => acc + (curr.budget || 0), 0);
    return { activeLeads: active, historyLeads: history, totalValue: total };
  }, [data]);

  // --- 3. MUTATIONS ---
  const [updateStatus] = useMutation(UPDATE_STATUS_MUTATION);
  const [deleteLead] = useMutation(DELETE_LEAD);
  const [sendProposal] = useMutation(SEND_PROPOSAL_MUTATION);

  // --- 4. UI STATES ---
  const [tabValue, setTabValue] = useState(0);
  const [proposalLoading, setProposalLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLead, setMenuLead] = useState<Lead | null>(null);

  // --- 5. HANDLERS ---
  const handleStatusChange = async (id: string, event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    try {
      await updateStatus({ variables: { id, status: newStatus } });
      setToast({ open: true, msg: `Status updated`, type: "success" });
    } catch (err: unknown) {
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

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead({ variables: { id } });
      setToast({
        open: true,
        msg: "Lead deleted successfully",
        type: "success",
      });
    } catch (err) {
      setToast({ open: true, msg: "Failed to delete lead", type: "error" });
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
        return { color: "#464646ff", bg: "#fef2f2", label: "Meeting Booked" };
      default:
        return { color: "grey", bg: "#f3f4f6", label: status };
    }
  };

  const chartData = [
    { name: "Mon", leads: 2 },
    { name: "Tue", leads: 4 },
    { name: "Wed", leads: 1 },
    { name: "Thu", leads: 5 },
    { name: "Fri", leads: activeLeads.length },
    { name: "Sat", leads: 3 },
    { name: "Sun", leads: 2 },
  ];

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

      <Container maxWidth="xl" sx={{ pt: 4 }}>
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

        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
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
                {activeLeads.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Potential clients currently in pipeline
              </Typography>
            </Paper>
          </Grid>

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
                            <MenuItem value="PROPOSAL_SENT">
                              Proposal Sent
                            </MenuItem>
                            <MenuItem value="MEETING_BOOKED">
                              Meeting Booked
                            </MenuItem>
                            <MenuItem value="WON">Mark Won</MenuItem>
                            <MenuItem value="REJECTED">Mark Lost</MenuItem>
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setMenuLead(null);
        }}
      >
        <MenuItem
          onClick={(e) => menuLead && handleSendProposal(e, menuLead._id)}
        >
          {proposalLoading === menuLead?._id ? (
            <CircularProgress size={16} />
          ) : (
            <PictureAsPdf fontSize="small" sx={{ mr: 1, color: "#ef4444" }} />
          )}{" "}
          Send Proposal
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedLead(menuLead);
            setAnchorEl(null);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1, color: "#6366f1" }} /> Edit Lead
        </MenuItem>
        <MenuItem onClick={() => menuLead && handleDeleteLead(menuLead._id)}>
          <Delete fontSize="small" sx={{ mr: 1, color: "#ff0000" }} /> Delete
          Lead
        </MenuItem>
      </Menu>

      <EditLeadModal
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        STATUS_OPTIONS={[
          "NEW",
          "QUALIFIED",
          "WON",
          "PROPOSAL_SENT",
          "REJECTED",
          "MEETING_BOOKED",
        ]}
        Service_Type={["Web Dev", "App Dev", "AI Automation"]}
      />
    </Box>
  );
}
