"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InquiryData } from "@/app/graphQL/Inquiry.graphQl";

export default function InquiryTable({
  inquiries,
  totalCount,
  page,
  setPage,
  rowsPerPage,
}: {
  inquiries: InquiryData[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
}) {
  const theme = useTheme();

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  return (
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
          Inquiries
        </Typography>
      </Box>

      {inquiries.length > 0 ? (
        <>
          <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Name", "Email", "Company", "Message", "Date"].map(
                    (head) => (
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
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {inquiry.firstName} {inquiry.lastName}
                    </TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {inquiry.companyName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography
                        noWrap
                        variant="body2"
                        title={inquiry.message}
                      >
                        {inquiry.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
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
          <Typography color="text.secondary">No inquiries found.</Typography>
        </Box>
      )}
    </Paper>
  );
}
