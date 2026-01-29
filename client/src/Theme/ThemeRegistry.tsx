'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { getTheme } from './theme';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // 1. Default hum 'dark' rakhenge taaki hydration mismatch na ho
  const [mode, setMode] = React.useState<PaletteMode>('dark');

  // 2. Jaise hi component mount hoga, hum LocalStorage check karenge
  React.useEffect(() => {
    const savedMode = localStorage.getItem('appTheme'); // 'appTheme' key se read karo
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          
          // 3. Jab bhi mode change ho, usse LocalStorage mein save kar do
          localStorage.setItem('appTheme', newMode);
          
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}