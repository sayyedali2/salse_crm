"use client";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Person, Email, VpnKey, HelpOutline } from "@mui/icons-material";
import { useState } from "react";
import SendGridGuide from "./sendgridGuid";

const FORM_DATA = gql`
  mutation EnableEmail($data: emailEnableData!) {
    emailEnable(data: $data)
  }
`;

export default function EmailServiceEnableForm() {
  const [guidOpen, setGuidOpen] = useState(false);
  interface EmailEnableFormData {
    name: string;
    email: string;
    apiKey: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailEnableFormData>();

  const [mutationData, { loading }] = useMutation(FORM_DATA);

  const onSubmit = async (data: EmailEnableFormData) => {
    try {
      await mutationData({
        variables: { data: { ...data, apiKey: data.apiKey.trim() } },
      });
      alert("Configuration Saved!");
      reset();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Box maxWidth="sm">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h5" color="text.primary">
            Email Automation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect your SendGrid account to trigger real-time lead responses.
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Enter sender name"
            label="Sender Name"
            {...register("name", { required: "Sender name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Enter sender email"
            label="Sender Email"
            {...register("email", { required: "Sender email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Enter SendGrid API Key"
            type="password"
            label="SendGrid API Key"
            {...register("apiKey", { required: "SendGrid API Key is required" })}
            error={!!errors.apiKey}
            helperText={errors.apiKey?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ pt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Save Configuration"}
            </Button>

            <Button
              variant="outlined"
              startIcon={<HelpOutline />}
              onClick={() => setGuidOpen(true)}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              Setup Guide
            </Button>
          </Box>
        </Stack>
      </Box>

      <SendGridGuide open={guidOpen} onClose={() => setGuidOpen(false)} />
    </>
  );
}
