"use client";

import { useState } from "react";
import {  gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation"; // URL se ID lene ke liye
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CssBaseline,
  Chip,
  Divider,
  CircularProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";

// --- GRAPHQL MUTATION ---
const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($createBookingInput: CreateBookingInput!) {
    createBooking(createBookingInput: $createBookingInput) {
      _id
      meetingLink
      status
    }
  }
`;

// --- STYLED COMPONENTS ---
const BookingCard = styled(motion.div)({
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden",
  maxWidth: "900px",
  width: "100%",
  display: "flex",
  flexDirection: "row", // Desktop: Side by Side
  "@media (max-width: 900px)": {
    flexDirection: "column", // Mobile: Stack
  },
});

const Sidebar = styled(Box)({
  background: "#0f172a",
  color: "white",
  padding: "40px",
  flex: "0 0 35%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const Content = styled(Box)({
  padding: "40px",
  flex: 1,
  background: "#f8fafc",
});

// Dummy Slots (Real world me ye backend se aa sakte hain)
const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string; // URL se Lead ID mili

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [successData, setSuccessData] = useState<{ _id: string; meetingLink?: string; status?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  type CreateBookingResponse = {
    createBooking: {
      _id: string;
      meetingLink?: string;
      status?: string;
    };
  };

  type CreateBookingVars = {
    createBookingInput: {
      leadId: string;
      date: string;
      timeSlot: string;
    };
  };

  const [createBooking, { loading }] = useMutation<
    CreateBookingResponse,
    CreateBookingVars
  >(CREATE_BOOKING_MUTATION);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      setErrorMsg("Please select both Date and Time.");
      return;
    }

    try {
      const result = await createBooking({
        variables: {
          createBookingInput: {
            leadId: leadId,
            date: new Date(selectedDate).toISOString(), // ISO format zaroori hai
            timeSlot: selectedSlot,
          },
        },
      });
      const booking = result.data?.createBooking;
      if (booking) {
        setSuccessData(booking);
      } else {
        setErrorMsg("Booking failed. Try another slot.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message || "Booking failed. Try another slot.");
    }
  };

  if (successData) {
    // --- SUCCESS SCREEN ---
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 5, textAlign: "center", borderRadius: 4, maxWidth: 500 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: "#10b981", mb: 2 }} />
          </motion.div>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Meeting Confirmed!
          </Typography>
          <Typography color="textSecondary" mb={3}>
            Your slot has been reserved successfully. We have sent the details
            to your email.
          </Typography>

          <Alert
            severity="success"
            icon={<VideoCameraFrontIcon />}
            sx={{ textAlign: "left", mb: 3 }}
          >
            <strong>Google Meet Link:</strong>
            <br />
            <a
              href={successData.meetingLink}
              target="_blank"
              style={{ color: "#15803d" }}
            >
              {successData.meetingLink}
            </a>
          </Alert>

          <Button variant="outlined" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  // --- BOOKING FORM SCREEN ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <CssBaseline />

      <BookingCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Sidebar */}
        <Sidebar>
          <Typography
            variant="overline"
            color="#6366f1"
            fontWeight="bold"
            letterSpacing={2}
          >
            SalesPilot
          </Typography>
          <Typography variant="h4" fontWeight="bold" mt={1} mb={2}>
            Discovery Call
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={1}
            sx={{ opacity: 0.8 }}
          >
            <AccessTimeIcon fontSize="small" /> 30 Minutes
          </Box>
          <Box display="flex" alignItems="center" gap={1} sx={{ opacity: 0.8 }}>
            <VideoCameraFrontIcon fontSize="small" /> Google Meet
          </Box>
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            In this call, we will discuss your project requirements, budget, and
            how our team can help you build your product.
          </Typography>
        </Sidebar>

        {/* Right Content */}
        <Content>
          <Typography variant="h5" fontWeight="bold" mb={3} color="#1e293b">
            Select a Time
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Date Picker (Native HTML for simplicity) */}
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            1. Pick a Date
          </Typography>
          <TextField
            type="date"
            fullWidth
            sx={{ mb: 4, bgcolor: "white" }}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {/* Time Slots */}
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            2. Pick a Slot
          </Typography>
          <Grid container spacing={2} mb={4}>
            {TIME_SLOTS.map((slot) => (
              <Grid  component="div" key={slot}>
                <Chip
                  label={slot}
                  onClick={() => setSelectedSlot(slot)}
                  variant={selectedSlot === slot ? "filled" : "outlined"}
                  sx={{
                    cursor: "pointer",
                    bgcolor: selectedSlot === slot ? "#0f172a" : "white",
                    color: selectedSlot === slot ? "white" : "black",
                    fontWeight: "bold",
                    border: "1px solid #cbd5e1",
                    "&:hover": {
                      bgcolor: selectedSlot === slot ? "#0f172a" : "#f1f5f9",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !selectedDate || !selectedSlot}
            onClick={handleConfirm}
            sx={{
              py: 1.5,
              bgcolor: "#6366f1",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </Content>
      </BookingCard>
    </Box>
  );
}
