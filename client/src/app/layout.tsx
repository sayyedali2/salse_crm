import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "./lib/apollo-wrapper"; // Import karein
import Navbar from "@/component/Navbar";
// MUI Cache

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales CRM",
  description: "Automated Sales Pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <Navbar />
          {children}

        </ApolloWrapper>
      </body>
    </html>
  );
}
