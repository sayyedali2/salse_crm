"use client";
import { Snackbar, Alert } from "@mui/material";

export default function Notification({
  open,
  message,
  type,
  onClose,
}: any) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 50,
      }}
    >
      <Alert severity={type} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
