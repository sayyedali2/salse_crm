"use client";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Avatar,
  Stack,
  Chip,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  AttachMoney,
  PeopleAlt,
  Layers,
  Add,
  ChevronRight,
} from "@mui/icons-material";

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($skip: Int!, $take: Int!) {
    leads(skip: $skip, take: $take) {
      totalCount
      items {
        _id
        name
        status
        budget
        serviceType
      }
    }
    findMe {
      name
      avatar
    }
  }
`;

interface DashboardData {
  leads: {
    totalCount: number;
    items: {
      _id: string;
      name: string;
      status: string;
      budget: number;
      serviceType: string;
    }[];
  };
  findMe: {
    name: string;
    avatar: string;
  };
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Paper
    variant="outlined"
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          color: color,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

export default function OverviewPage() {
  const theme = useTheme();
  const { data, loading } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    variables: { skip: 0, take: 100 },
  });

  const stats = useMemo(() => {
    if (!data?.leads?.items) return null;
    const items = data.leads.items;

    const statusCounts: Record<string, number> = {};
    let totalBudget = 0;
    let wonCount = 0;

    items.forEach((l: any) => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
      totalBudget += l.budget || 0;
      if (["Closed", "Won"].includes(l.status)) wonCount++;
    });

    const serviceCounts: Record<string, number> = {};
    items.forEach((l: any) => {
      serviceCounts[l.serviceType || "Other"] =
        (serviceCounts[l.serviceType || "Other"] || 0) + 1;
    });

    return {
      statusData: Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      })),
      serviceData: Object.entries(serviceCounts)
        .map(([name, count]) => ({ name, count }))
        .slice(0, 6),
      totalBudget,
      conversionRate: ((wonCount / items.length) * 100).toFixed(1),
      recentLeads: items.slice(0, 5),
      totalCount: data.leads.totalCount,
    };
  }, [data]);

  if (loading)
    return (
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      {/* TOOLBAR AREA */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          py: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ letterSpacing: -0.5 }}
            >
              Business Intelligence
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={data?.findMe?.avatar}
                sx={{ width: 32, height: 32 }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* STATS ROW */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <StatCard
              title="Active Leads"
              value={stats?.totalCount}
              icon={PeopleAlt}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <StatCard
              title="Forecasted Revenue"
              value={`₹${((stats?.totalBudget || 0) / 1000).toFixed(1)}k`}
              icon={AttachMoney}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <StatCard
              title="Win Rate"
              value={`${stats?.conversionRate}%`}
              icon={TrendingUp}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <StatCard
              title="Active Services"
              value={stats?.serviceData.length}
              icon={Layers}
              color={theme.palette.info.main}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* LEFT: BAR CHART */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{ p: 4, borderRadius: 2, bgcolor: "background.paper" }}
            >
              <Typography variant="h6" fontWeight={700} mb={4}>
                Service Volume
              </Typography>
              <Box sx={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={stats?.serviceData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={theme.palette.divider}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT: PIE CHART */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{ p: 4, borderRadius: 2, bgcolor: "background.paper" }}
            >
              <Typography variant="h6" fontWeight={700} mb={4}>
                Status Breakdown
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 350,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats?.statusData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats?.statusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* RECENT LEADS TABLE */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              <Box
                px={3}
                py={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor={alpha(theme.palette.action.hover, 0.3)}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Recent Enquiries
                </Typography>
                <Button size="small" endIcon={<ChevronRight />}>
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        CLIENT NAME
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        SERVICE TYPE
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        BUDGET
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.recentLeads.map((lead: any) => (
                      <TableRow key={lead._id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: "0.7rem",
                                bgcolor: "primary.main",
                              }}
                            >
                              {lead.name[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {lead.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {lead.serviceType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 1,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700}>
                            ₹{lead.budget?.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
