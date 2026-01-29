"use client";

import { useEffect, useState, Suspense } from "react";
import Loader from "@/component/loding";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNotification } from "@/context/NotificationContext";

// Validation Schema
const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SETUP_ACCOUNT_MUTATION = gql`
  mutation SetupAccount($input: SetupAccountInput!) {
    setupAccount(input: $input) {
      _id
      email
      status
    }
  }
`;

function SetupAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const token = searchParams.get("token");

  const [setupAccount, { loading }] = useMutation(SETUP_ACCOUNT_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) {
      notify("Invalid or missing token", "error");
      return;
    }

    try {
      await setupAccount({
        variables: {
          input: { password: data.password, token },
        },
      });
      notify("Account setup successfully!", "success");
      router.push("/login"); // Setup ke baad login pe bhejna better hai
    } catch (error: any) {
      notify(error.message || "Failed to setup account", "error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Setup Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter a secure password to activate your account.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !token}
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default function SetupAccount() {
  return (
    <Suspense fallback={<Loader message={""} />}>
      <SetupAccountContent />
    </Suspense>
  );
}
