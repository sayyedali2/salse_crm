"use client";

import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { CloudUpload, Send } from "@mui/icons-material";

export default function ExcelImport({
  onLeadAdded,
}: {
  onLeadAdded?: () => void;
}) {
  const [initialFile, setInitialFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setInitialFile(file);
  };

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  const handleUpload = async () => {
    if (!initialFile) {
      console.log("No file selected");
      return;
    }
    console.log("token: ", token);
    const formData = new FormData();
    formData.append("file", initialFile);
    try {
      const res = await fetch("http://localhost:3001/leads/import", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (onLeadAdded) onLeadAdded();
      if (!res) throw new Error("Failed to upload file");
      const data = await res.json();
      console.log("Server Response:", data);
    } catch (error) {
      console.log("ye upload wali error he: ", error);
    }
  };

  return (
    <Paper
      elevation={0} // Outlined look zyada modern lagta hai dark mode mein
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 }, // Mobile par padding kam
        width: "100%", // 80% mobile par chota lagega, container handles width
        maxWidth: "500px", // Desktop par bahut zyada stretch na ho
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2.5}>
        {/* Header Section */}
        <Box textAlign={"center"}>
          <Typography
            variant="h6"
            fontWeight="800"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            Bulk Import Leads
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload your .xlsx or .xls file to sync data.
          </Typography>
        </Box>

        <Divider />

        {/* Upload Actions - Responsive Stack */}
        <Stack
          direction={{ xs: "column", sm: "row" }} // Mobile par niche-upar, Desktop par ek line mein
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
            accept=".xlsx, .xls"
          />

          <label htmlFor="fileInput" style={{ width: "100%" }}>
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUpload />}
              sx={{
                textTransform: "none",
                height: "48px", // Better touch target for mobile
                borderRadius: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {initialFile ? initialFile.name : "Choose File"}
            </Button>
          </label>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!initialFile}
            endIcon={<Send />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              height: "48px",
              px: 4,
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            Upload
          </Button>
        </Stack>

        {/* File details hint */}
        {initialFile && (
          <Box
            sx={{
              p: 1,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              color="success.main"
              fontWeight="bold"
            >
              Ready to sync: {(initialFile.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
