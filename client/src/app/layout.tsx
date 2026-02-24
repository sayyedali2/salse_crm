"use client";


import { ApolloWrapper } from "./lib/apollo-wrapper"; // Import karein
import ThemeRegistry from "@/Theme/ThemeRegistry";


import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <ThemeRegistry>
            <NotificationProvider>
            {children}
            </NotificationProvider>
          </ThemeRegistry>
          {/* <Navbar /> */}
        </ApolloWrapper>
      </body>
    </html>
  );
}
