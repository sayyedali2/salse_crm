"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import { Visibility, Person, HourglassEmpty, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useMemo } from "react";
import ViewDialog from "./viewDiloag";
import { TeamData } from "@/app/(dashboard)/team/page";
import AddNewTeamMember from "./addNewTeamMember";

export default function TeamTable({
  TeamMembers,
  totalCount,
  page,
  setPage,
  rowsPerPage,
  onLeadAdded,
}: {
  TeamMembers: TeamData[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  onLeadAdded?: () => void;
}) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0); // 0 for ACTIVE, 1 for PENDING
  const [open, setOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState<TeamData | null>(null);

  // Filter data based on Tab
  const filteredMembers = useMemo(() => {
    const statusToFilter = tabValue === 0 ? "ACTIVE" : "PENDING";
    return TeamMembers.filter((member) => member.status === statusToFilter);
  }, [TeamMembers, tabValue]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1); // Tab change hone par first page par le jayein
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTeamMemberOpen = (member: TeamData) => {
    setActiveTeamMember(member);
    setOpen(true);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight={800}>
            Team Management
          </Typography>
          <Button
  variant="contained"
  size="small"
  onClick={() => setAddNewOpen(true)}
  // Mobile par icon central rahega, desktop par text ke sath
  startIcon={<Add />} 
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 700,
    // Responsive Height
    height: { xs: '36px', sm: '40px' },
    // Responsive Padding: Mobile par chota (squareish), Desktop par lamba
    minWidth: { xs: '40px', sm: 'auto' },
    px: { xs: 1, sm: 2 },
    
    // Icon ki position handle karne ke liye (Optional)
    '& .MuiButton-startIcon': {
      margin: { xs: 0, sm: '0 8px 0 -4px' }
    }
  }}
>
  {/* Screen 600px se badi hone par hi text dikhega */}
  <Box 
    component="span" 
    sx={{ 
      display: { xs: 'none', sm: 'inline' } 
    }}
  >
    Add Member
  </Box>

  {/* Mobile par sirf "+" dikhane ke liye aap "+" ko Box ke bahar bhi rakh sakte hain 
      lekin startIcon use karna best practice hai */}
</Button>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="team status tabs">
            <Tab 
              icon={<Person sx={{ fontSize: '1.2rem' }} />} 
              iconPosition="start" 
              label={`Active (${TeamMembers.filter(m => m.status === 'ACTIVE').length})`} 
            />
            <Tab 
              icon={<HourglassEmpty sx={{ fontSize: '1.2rem' }} />} 
              iconPosition="start" 
              label={`Pending (${TeamMembers.filter(m => m.status === 'PENDING').length})`} 
            />
          </Tabs>
        </Box>

        {filteredMembers.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Name", "Email", "Status", "Role", "Phone", "Actions"].map((head) => (
                      <TableCell
                        key={head}
                        sx={{
                          bgcolor: theme.palette.background.default,
                          fontWeight: 700,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member._id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          size="small"
                          color={member.status === "ACTIVE" ? "success" : "warning"}
                          
                          sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {member.role.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleTeamMemberOpen(member)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ p: 2, display: "flex", justifyContent: "center", borderTop: `1px solid ${theme.palette.divider}` }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          </>
        ) : (
          <Box sx={{ p: 10, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No {tabValue === 0 ? "active" : "pending"} members found.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dialogs */}
      <ViewDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveTeamMember(null);
        }}
        user={activeTeamMember}
      />
      <AddNewTeamMember
        open={addNewOpen}
        setOpen={setAddNewOpen}
        onLeadAdded={onLeadAdded}
      />
    </>
  );
}