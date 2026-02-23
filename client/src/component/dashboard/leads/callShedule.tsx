import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    CircularProgress,
    Stack,
    Divider,
} from "@mui/material";
import { LeadsData } from "@/app/(dashboard)/leads/page";
import { Close, Event, Delete, Schedule } from "@mui/icons-material";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    GET_SCHEDULED_CALLS,
    SCHEDULE_CALL,
    DELETE_SCHEDULED_CALL,
} from "@/app/graphQL/Calling.graphQl";
import { useNotification } from "@/context/NotificationContext";

interface ScheduledCall {
    _id: string;
    leadId: {
        _id: string;
        name: string;
        phone: string;
    };
    sheduleTime: string;
    status: string;
}

interface GetScheduledCallsData {
    getScheduledCalls: ScheduledCall[];
}

interface GetScheduledCallsVars {
    leadId?: string;
}

export function CallShedule({
    open,
    setOpen,
    lead,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    lead: LeadsData | null;
}) {
    const { notify } = useNotification();
    const [scheduleTime, setScheduleTime] = useState("");

    const { data, loading, refetch } = useQuery<GetScheduledCallsData, GetScheduledCallsVars>(GET_SCHEDULED_CALLS, {
        variables: { leadId: lead?._id },
        skip: !lead?._id || !open,
        fetchPolicy: "network-only",
    });

    const [scheduleCall, { loading: scheduling }] = useMutation(SCHEDULE_CALL, {
        onCompleted: () => {
            notify("Call scheduled successfully");
            setScheduleTime("");
            refetch();
        },
        onError: (err) => {
            notify(`Failed to schedule call: ${err.message}`, "error");
        },
    });

    const [deleteCall, { loading: deleting }] = useMutation(
        DELETE_SCHEDULED_CALL,
        {
            onCompleted: () => {
                notify("Scheduled call deleted");
                refetch();
            },
            onError: (err) => {
                notify(`Failed to delete call: ${err.message}`, "error");
            },
        }
    );

    const handleClose = () => {
        setOpen(false);
        setScheduleTime("");
    };

    const handleSchedule = () => {
        if (!scheduleTime || !lead) return;
        scheduleCall({
            variables: {
                data: {
                    leadId: lead._id,
                    sheduleTime: new Date(scheduleTime).toISOString(),
                },
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to cancel this scheduled call?")) {
            deleteCall({ variables: { id } });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Schedule color="primary" />
                    <Typography variant="h6">Schedule Call</Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, bgcolor: "background.default" }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Schedule a call for
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {lead?.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                        <TextField
                            type="datetime-local"
                            fullWidth
                            size="small"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            label="Select Date & Time"
                            sx={{
                                "& input::-webkit-calendar-picker-indicator": {
                                    filter: (theme) => theme.palette.mode === "dark" ? "invert(1)" : "none",
                                    cursor: "pointer",
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            disabled={!scheduleTime || scheduling}
                            onClick={handleSchedule}
                            startIcon={
                                scheduling ? <CircularProgress size={20} /> : <Event />
                            }
                            sx={{ minWidth: 120, height: 40 }}
                        >
                            Schedule
                        </Button>
                    </Stack>
                </Box>

                <Divider />

                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Upcoming Calls
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : data?.getScheduledCalls && data.getScheduledCalls.length > 0 ? (
                        <List>
                            {data.getScheduledCalls.map((call: any) => (
                                <ListItem
                                    key={call._id}
                                    sx={{
                                        bgcolor: "background.paper",
                                        mb: 1,
                                        borderRadius: 1,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <ListItemText
                                        primary={new Date(call.sheduleTime).toLocaleString()}
                                        secondary={
                                            <Chip
                                                label={call.status}
                                                size="small"
                                                color={
                                                    call.status === "PENDING"
                                                        ? "warning"
                                                        : call.status === "DONE"
                                                            ? "success"
                                                            : "default"
                                                }
                                                sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                                            />
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDelete(call._id)}
                                            disabled={deleting}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 3 }}
                        >
                            No scheduled calls found.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}