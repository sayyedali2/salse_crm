"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CssBaseline,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";

// --- GRAPHQL MUTATION ---
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

// --- STYLED COMPONENTS ---
const LoginCard = styled(motion.div)({
  background: "#ffffff",
  borderRadius: "24px",
  // Soft Shadow for depth
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  padding: "48px",
  maxWidth: "450px",
  width: "100%",
  textAlign: "center",
  position: "relative",
  zIndex: 10,
});

const LightInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#334155", // Dark Text
    borderRadius: "12px",
    backgroundColor: "#f8fafc", // Very light grey bg for input
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "#e2e8f0" }, // Light Border
    "&:hover fieldset": { borderColor: "#94a3b8" }, // Darker on hover
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1", // Indigo focus
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.1)",
    },
  },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  "& .MuiInputAdornment-root": { color: "#94a3b8" },
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { loading }] = useMutation<
    { login: { access_token: string } },
    { email: string; password: string }
  >(LOGIN_MUTATION);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login?.access_token) {
        localStorage.setItem("token", data.login.access_token);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid Email or Password";
      setErrorMsg(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f1f5f9", // Light Slate Background
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      {/* Subtle Background Pattern/Gradient */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 50% 0%, #e0e7ff 0%, transparent 50%)",
          zIndex: 1,
        }}
      />

      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Avatar
            sx={{
              bgcolor: "#eef2ff",
              color: "#6366f1",
              width: 64,
              height: 64,
              margin: "0 auto 16px",
            }}
          >
            <LoginIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h4"
            fontWeight="800"
            color="#1e293b"
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="#64748b">
            Sign in to manage your leads
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <LightInput
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <LightInput
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.8,
                borderRadius: "12px",
                // Indigo Gradient
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
                transition: "all 0.2s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </form>

        {/* Footer Link */}
        <Box mt={4}>
          <Typography variant="caption" color="#94a3b8">
            Not an Admin?{" "}
            <Link
              href="/"
              style={{
                color: "#6366f1",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Go Home
            </Link>
          </Typography>
        </Box>
      </LoginCard>
    </Box>
  );
}
