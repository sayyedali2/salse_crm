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
import { Visibility, Person, HourglassEmpty } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useMemo } from "react";
import ViewDialog from "./viewDiloag";
import { OrganizationData } from "@/app/graphQL/Organization.graphQl";

export default function TeamTable({
  Organization,
  totalCount,
  page,
  setPage,
  rowsPerPage,
}: {
  Organization: OrganizationData[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeOrganization, setActiveOrganization] =
    useState<OrganizationData | null>(null);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleOrganizationOpen = (member: OrganizationData) => {
    setActiveOrganization(member);
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
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Super Admin
          </Typography>
        </Box>

        {Organization.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "Name",
                      "Email",
                      "Domain",
                      "Owner",
                      "Phone",
                      "Actions",
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
                  {Organization.map((member) => (
                    <TableRow key={member._id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {member.domain}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {member.ownerName}
                        </Typography>
                      </TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOrganizationOpen(member)}
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
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "center",
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
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
          <Box sx={{ p: 10, textAlign: "center" }}>
            <Typography color="text.secondary">
              No Organization found.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dialogs */}
      <ViewDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveOrganization(null);
        }}
        user={activeOrganization}
      />
    </>
  );
}
