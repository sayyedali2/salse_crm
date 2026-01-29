import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { WarningAmberRounded } from "@mui/icons-material";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
}: DeleteConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 1,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <WarningAmberRounded
          sx={{
            fontSize: 60,
            color: theme.palette.error.main,
            bgcolor: alpha(theme.palette.error.main, 0.1),
            borderRadius: "50%",
            p: 1.5,
            mb: 1,
          }}
        />
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          textAlign="center"
          sx={{ color: theme.palette.text.secondary }}
        >
          {description}
          {itemName && (
            <Typography
              component="span"
              display="block"
              fontWeight={700}
              sx={{ mt: 1, color: theme.palette.text.primary }}
            >
              "{itemName}"
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3, px: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            py: 1.2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="error"
          fullWidth
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            py: 1.2,
            boxShadow: `0 8px 20px -4px ${alpha(theme.palette.error.main, 0.5)}`,
          }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
