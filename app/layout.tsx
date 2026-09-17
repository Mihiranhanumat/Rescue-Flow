import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RESCUEFLOW — Autonomous Emergency Triage & Focus Command Center",
  description: "Transform task chaos into sequential execution. AI-powered triage radar, Eisenhower matrices, telemetry diagnostics, and tactical focus missions.",
  keywords: ["productivity", "triage", "focus", "eisenhower matrix", "emergency workflow", "ai task manager", "cyberpunk productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-100 font-sans">{children}</body>
    </html>
  );
}
