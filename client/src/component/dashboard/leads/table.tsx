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
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Visibility, Close, Add } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import ViewDialog from "./viewDiloag";
import { LeadsData } from "@/app/(dashboard)/leads/page";
import AddNewLead from "./addNewLead";
import { Pagination } from "@mui/material";
import ExcelImport from "@/component/exceImport";

export default function LeadsTable({
  leads,
  totalCount,
  page,
  setPage,
  rowsPerPage,
  onLeadAdded,
}: {
  leads: LeadsData[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  onLeadAdded?: () => void;
}) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const [open, setOpen] = useState(false);
  const [addNewLeadOpen, setAddNewLeadOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<LeadsData | null>(null);
  const theme = useTheme();
  console.log(leads);

  // Update activeLead when leads list changes (e.g. via subscription)
  useEffect(() => {
    if (activeLead && open) {
      const updatedLead = leads.find((l) => l._id === activeLead._id);
      if (updatedLead) {
        setActiveLead(updatedLead);
      }
    }
  }, [leads, activeLead, open]);
  const [importOpen, setImportOpen] = useState(false);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value); // Ye Parent ki state update karega aur query dobara chalegi
  };

  const handleLeadOpen = (lead: LeadsData) => {
    setActiveLead(lead);
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
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            maxHeight: "10vh",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" fontWeight={900}>
            Recent Leads
          </Typography>
          <Box sx={{ p: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setAddNewLeadOpen(true)}
              // 'startIcon' tab dikhega jab screen badi hogi
              startIcon={<Add />}
              sx={{
                // Responsive Height: Mobile par 36px, Desktop par 40px (Standard size)
                height: { xs: "36px", sm: "40px" },
                // Padding: Mobile par square shape (taaki sirf icon dikhe agar hum text chhupayein)
                px: { xs: 1.5, sm: 3 },
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none", // Capitalization off karne ke liye

                // Responsive Text: Mobile par text chhota ya hide kar sakte hain
                fontSize: { xs: "0.8rem", sm: "0.875rem" },

                // Agar aap chahte hain ki mobile par "+ Lead" ki jagah sirf "+" dikhe:
                "& .MuiButton-startIcon": {
                  margin: { xs: 0, sm: "0 8px 0 -4px" },
                },
              }}
            >
              {/* Screen 600px (sm) se choti hone par text hide ho jayega (Optional) */}
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Add Lead
              </Box>

              {/* Mobile par sirf icon dikhane ke liye aap upar wala Box use kar sakte hain 
      ya simple "+ Lead" likh sakte hain jo stack ho jayega */}
              <Box
                component="span"
                sx={{ display: { xs: "inline", sm: "none" } }}
              >
                Lead
              </Box>
            </Button>
            <Button
              variant="contained"
              sx={{ height: { xs: "36px", sm: "40px" }, }}
              onClick={() => setImportOpen(true)}
            >
              Import
            </Button>
          </Box>
        </Box>
        {leads.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 360px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "Name",
                      "Email",
                      "Status",
                      "Budget",
                      "Service Type",
                      "View",
                    ].map((head) => (
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
                  {leads.map((lead, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {lead.name}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>

                      <TableCell>
                        <Chip
                          label={lead.status}
                          size="small"
                          sx={{
                            color: "primary.background",
                            fontWeight: 700,
                            p: 2,
                          }}
                        />
                      </TableCell>

                      <TableCell>{lead.budget}</TableCell>
                      <TableCell>{lead.serviceType}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleLeadOpen(lead)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "center",
                backgroundColor: "background.paper",
                borderTop: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 500,
                    minWidth: 36,
                    height: 26,
                  },
                  "& .Mui-selected": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: "#fff",
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            No leads found
          </Typography>
        )}
      </Paper>
      <ViewDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveLead(null);
        }}
        lead={activeLead}
      />
      <AddNewLead
        open={addNewLeadOpen}
        setOpen={setAddNewLeadOpen}
        onLeadAdded={onLeadAdded}
      />

      <Dialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        fullWidth
        maxWidth="sm" // Size ko control karne ke liye

        // sx={{display:'flex', justifyContent:'center', alignItems:'center',border:'2px solid red'}}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Import Leads from Excel
          <IconButton
            aria-label="close"
            onClick={() => setImportOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* ExcelImport ko yahan rakhein taaki padding sahi mile */}
          <ExcelImport
            onLeadAdded={() => {
              onLeadAdded; // Refresh Table
              setImportOpen(false); // Success ke baad Dialog band karein
            }}
          />
        </DialogContent>

        {/* Actions agar aapko niche extra buttons chahiye, warna Content hi kaafi hai */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Supported formats: .xlsx, .xls (Max 5MB)
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}
