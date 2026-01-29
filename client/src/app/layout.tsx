"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "./lib/apollo-wrapper"; // Import karein
import ThemeRegistry from "@/Theme/ThemeRegistry";
import Navbar from "@/component/Navbar";


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
