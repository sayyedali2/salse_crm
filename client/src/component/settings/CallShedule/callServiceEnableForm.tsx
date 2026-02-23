"use client";
import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import { VpnKey, RecordVoiceOver, Phone } from "@mui/icons-material";
import { useNotification } from "@/context/NotificationContext"; // Assuming this context exists or use standard alert
import { useEffect } from "react";

const VAPI_CONFIGURE = gql`
  mutation VapiConfigure($data: VapiAgentConfigureInput!) {
    vapiConfigure(data: $data) {
      _id
      vapiApiKey
      vapiAssistantId
      vapiPhoneNumberId
    }
  }
`;

interface VapiConfigureFormData {
    vapiApikey: string;
    vapiAssistantId: string;
    vapiPhoneNumberId?: string;
}

export default function CallServiceEnableForm() {
    const { notify } = useNotification();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VapiConfigureFormData>();

    const [configureVapi, { loading: saving }] = useMutation(VAPI_CONFIGURE, {
        onCompleted: () => {
            notify("Vapi configuration saved successfully!", "success");
        },
        onError: (error) => {
            notify(error.message, "error");
        },
    });

    const GET_ORG_SETTINGS = gql`
        query GetOrgSettings {
            getOrgSettings {
                vapiApiKey
                vapiAssistantId
                vapiPhoneNumberId
            }
        }
    `;

    interface OrgSettingsData {
        getOrgSettings: {
            vapiApiKey: string;
            vapiAssistantId: string;
            vapiPhoneNumberId?: string;
        };
    }

    const { data: orgData, loading: fetching } = useQuery<OrgSettingsData>(GET_ORG_SETTINGS, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (orgData?.getOrgSettings) {
            setValue("vapiApikey", orgData.getOrgSettings.vapiApiKey || "");
            setValue("vapiAssistantId", orgData.getOrgSettings.vapiAssistantId || "");
            if (orgData.getOrgSettings.vapiPhoneNumberId) {
                setValue("vapiPhoneNumberId", orgData.getOrgSettings.vapiPhoneNumberId);
            }
        }
    }, [orgData, setValue]);

    const onSubmit = (data: VapiConfigureFormData) => {
        configureVapi({
            variables: {
                data: {
                    vapiApikey: data.vapiApikey.trim(),
                    vapiAssistantId: data.vapiAssistantId.trim(),
                    vapiPhoneNumberId: data.vapiPhoneNumberId?.trim(),
                },
            },
        });
    };

    return (
        <Box maxWidth="sm">
            <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="h5" color="text.primary">
                    Voice AI Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure Vapi.ai credentials to enable automated voice calling features.
                </Typography>
            </Stack>

            <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Vapi Private API Key"
                    placeholder="Enter your Vapi Private API Key"
                    type="password"
                    {...register("vapiApikey", { required: "API Key is required" })}
                    error={!!errors.vapiApikey}
                    helperText={errors.vapiApikey?.message}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKey color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Assistant ID"
                    placeholder="Enter your Assistant ID"
                    {...register("vapiAssistantId", { required: "Assistant ID is required" })}
                    error={!!errors.vapiAssistantId}
                    helperText={errors.vapiAssistantId?.message}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <RecordVoiceOver color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Phone Number ID (Optional)"
                    placeholder="Enter your Phone Number ID"
                    {...register("vapiPhoneNumberId")}
                    error={!!errors.vapiPhoneNumberId}
                    helperText={errors.vapiPhoneNumberId?.message}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Phone color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ pt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving || fetching}
                        startIcon={(saving || fetching) && <CircularProgress size={20} color="inherit" />}
                    >
                        {saving ? "Saving..." : "Save Configuration"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}