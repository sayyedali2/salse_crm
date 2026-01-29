import { createTheme, PaletteMode, alpha } from "@mui/material";

// --- Landing Page Palette (Black & White Monotone) ---
const darkPalette = {
  bg: "#000000", // Pitch Black
  paper: "#1e1e1e", // Solid Dark Gray (No Transparency)
  text: "#ffffff", // Pure White text
  primary: "#ffffff", // Primary actions are White
  secondary: "#94a3b8", // Muted text for secondary info
  border: "rgba(255, 255, 255, 0.15)", // Subtle borders
  inputBg: "rgba(255, 255, 255, 0.03)", // Inputs stay slightly distinct
};

const lightPalette = {
  bg: "#ffffff",
  paper: "#f8fafc",
  text: "#000000",
  primary: "#000000", // Light mode me Primary Black hoga
  secondary: "#475569",
  border: "rgba(0, 0, 0, 0.15)",
  inputBg: "#f1f5f9",
};

export const getTheme = (mode: PaletteMode) => {
  const colors = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary, // White in Dark Mode, Black in Light Mode
      },
      background: {
        default: colors.bg,
        paper: colors.paper,
      },
      text: {
        primary: colors.text,
        secondary: colors.secondary,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: '"Inter", sans-serif', // Modern font
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    components: {
      // 1. Buttons (Black & White Contrast)
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "10px 24px",
          },
          contained: {
            // Dark Mode: Button White hoga, Text Black hoga (High Contrast)
            backgroundColor: colors.primary,
            color: mode === "dark" ? "#000000" : "#ffffff",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#e2e2e2" : "#333333",
            },
          },
          outlined: {
            borderColor: colors.border,
            color: colors.text,
            "&:hover": {
              borderColor: colors.primary,
              backgroundColor: alpha(colors.primary, 0.05),
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "& ::selection": {
              backgroundColor: "#00A3FF",
              color: "#ffffff",
            },
            "& ::-moz-selection": {
              backgroundColor: "#00A3FF",
              color: "#ffffff",
            },
          },
        },
      },
      // 2. Text Fields (Inputs)
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.inputBg, // Glassy Transparent
            borderRadius: 12, // Thoda zyada round for modern look
            color: colors.text,
            "& fieldset": {
              borderColor: colors.border,
            },
            "&:hover fieldset": {
              borderColor: alpha(colors.primary, 0.5), // Hover pe thoda white
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary, // Focus pe Pure White
              borderWidth: "1px",
            },
          },
          input: {
            "&::placeholder": {
              color: alpha(colors.text, 0.4),
              opacity: 1,
            },
          },
        },
      },
      // 3. Label (Text above input)
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.secondary,
            "&.Mui-focused": {
              color: colors.primary, // Focus hone pe White
            },
          },
        },
      },
      // 4. Input Icons (Start Adornment)
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: colors.secondary, // Gray icons default
            ".Mui-focused &": {
              color: colors.primary, // Focus hone pe White icons
            },
          },
        },
      },
      // 5. Dialog & Paper (Glassmorphism Global)
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          // Agar hum Dialog ya Card use karein to default glass effect aye
          rounded: {
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.paper, // Solid, no transparency
            boxShadow:
              mode === "dark"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.9)"
                : undefined,
          },
        },
      },
    },
  });
};
