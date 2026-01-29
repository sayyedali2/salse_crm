"use client";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Link,
  Box,
} from "@mui/material";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const forgatPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const forgatPasswordMutation = gql`
  mutation ForgatPassword($input: ForgatPasswordInput!) {
    forgatePassword(input: $input) {
    message
    }
  }
`;

export function ForgatPassword({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { notify } = useNotification();
  const [forgatePassword] = useMutation(forgatPasswordMutation);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgatPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await forgatePassword({ variables: { input: data } });
      notify(
        "Forgate Password Link Sent Successfully on your Register Email!!!"
      );
      reset();
      setOpen(false);
    } catch (error: any) {
      notify(error.message || "Something went wrong!!!");
    }
  });

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          height: { xs: "auto", md: "66vh" },

          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: { xs: 2, sm: 3 }, // Mobile par thoda kam padding
          borderRadius: "16px", // Thoda modern look
        },
      }}
    >
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          color: "text.secondary",
          "&:hover": { color: "text.primary", bgcolor: "action.hover" },
          height: "40px",
          width: "40px",
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1, // Taki ye upar rahe
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        variant="h4"
        textAlign="center"
        sx={{
          mt: 2,
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", md: "2.125rem" }, // Mobile par heading thodi chhoti
        }}
      >
        Forgat Password
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: { xs: 1, md: 2 },
          overflowY: "visible", // Scrolling issues se bachne ke liye
        }}
      >
        <TextField
          fullWidth
          label="Email"
          {...register("email")}
          placeholder="xyz@gmail.com"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 3, // Bottom padding for better spacing
          px: 3,
        }}
      >
        <Button
          onClick={onSubmit}
          variant="outlined" // Login ke liye 'contained' zyada clickable lagta hai
          sx={{
            py: 1.2,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "1rem",
            width: "50%",
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
