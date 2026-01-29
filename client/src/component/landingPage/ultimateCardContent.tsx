"use client";
import { Box, Stack, Typography } from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";

export const UltimateCardContent = ({ title, subtitle, icon }: any) => (
  <Box
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "16px",
          bgcolor: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "grey.500", lineHeight: 1.6 }}>
        {subtitle}
      </Typography>
    </Box>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ opacity: 0.6 }}
    >
      <Typography variant="button" fontWeight="bold">
        DEPLOY
      </Typography>
      <NorthEastIcon fontSize="small" />
    </Stack>
  </Box>
);
