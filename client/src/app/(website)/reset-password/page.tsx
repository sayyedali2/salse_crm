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
import { useEffect, useState, Suspense } from "react";
import Loader from "@/component/loding";
import { useSearchParams } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const resetPasswordMutation = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [open, setOpen] = useState(false);
  const { notify } = useNotification();
  const [resetPassword] = useMutation(resetPasswordMutation);
  const router = useRouter();
  useEffect(() => {
    if (token) {
      setOpen(true);
    } else {
      notify("Invalid or missing reset token");
      router.push("/login");
    }
  }, [token]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!token) {
        notify("Reset token is missing or expired");
        return;
      }

      const { confirmPassword, ...input } = {
        ...data,
        token,
      };
      const res = await resetPassword({ variables: { input } });
      if (res) {
        notify("Password Reset Successfully!!!");
        reset();
        setOpen(false);
        router.push("/");
      }
    } catch (error: any) {
      notify(error.message || "Something went wrong!!!");
    }
  });
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      // 'sm' ya 'xs' maxWidth set karne se mobile par dialog natural lagega
      maxWidth="sm"
      PaperProps={{
        sx: {
          // Mobile par height 'auto' rakhte hain taki keyboard space le sake
          // Desktop par '65vh' maintain kar sakte hain
          height: { xs: "auto", md: "66vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: { xs: 2, sm: 3 }, // Mobile par thoda kam padding
          borderRadius: "16px", // Thoda modern look
        },
      }}
    >
      <DialogTitle
        variant="h4"
        textAlign="center"
        sx={{
          mt: 2,
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", md: "2.125rem" }, // Mobile par heading thodi chhoti
        }}
      >
        Reset Password
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
          label="Password"
          {...register("password")}
          placeholder="********"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          fullWidth
          type="password" // Password field ko mask karne ke liye
          label="Confirm Password"
          {...register("confirmPassword")}
          placeholder="********"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<Loader message={""} />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
