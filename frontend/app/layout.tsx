import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-d",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-b",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CareerForge AI - AI-Powered Career Documents",
  description:
    "Build ATS-optimized resumes, tailor them to any job in seconds, generate cover letters and scholarship documents — all in one AI-powered platform.",
  keywords: [
    "resume builder",
    "ATS resume",
    "cover letter generator",
    "job application",
    "scholarship",
    "AI resume",
  ],
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
