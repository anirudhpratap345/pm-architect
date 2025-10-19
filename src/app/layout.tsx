import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import GradientOverlay from "@/components/common/GradientOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMArchitect.ai — AI-driven Metric Comparison for Everyone",
  description: "Compare technologies, frameworks, and systems intelligently with AI-driven insights, validation, and recommendations.",
  openGraph: {
    title: "PMArchitect.ai",
    description: "AI-driven metric comparison for builders, founders, and developers.",
    url: "https://www.pmarchitect.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMArchitect.ai — AI-driven metric comparison for everyone",
    description: "Compare technologies, models, and architectures with metrics, evidence, and recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <meta name="theme-color" content="#0A0A0A" />
        <ClientLayout>
          <GradientOverlay />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
