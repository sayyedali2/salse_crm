"use client";

import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";

export default function TitleBox({
  titleOne,
  titleOneValue,
  titleTwo,
  titleTwoValue,
}: {
  titleOne: string;
  titleOneValue: string;
  titleTwo: string;
  titleTwoValue: string;
}) {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ p: { xs: 1, md: 2 } }}>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={600}
              >
                {titleOne}
              </Typography>
              <Typography variant="body1" fontWeight={800} sx={{ mt: 1 }}>
                {titleOneValue}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={600}
              >
                {titleTwo}
              </Typography>
              <Typography variant="body1" fontWeight={800} sx={{ mt: 1 }}>
                {titleTwoValue}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
