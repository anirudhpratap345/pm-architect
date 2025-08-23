import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMArchitect.ai - AI-Driven Decision Intelligence Platform",
  description: "Enable product-facing roles to make architectural and ML model decisions with clarity, speed, and confidence.",
  keywords: ["product management", "decision making", "AI architecture", "ML models", "technical decisions"],
  authors: [{ name: "PMArchitect.ai Team" }],
  creator: "PMArchitect.ai",
  openGraph: {
    title: "PMArchitect.ai - AI-Driven Decision Intelligence Platform",
    description: "Enable product-facing roles to make architectural and ML model decisions with clarity, speed, and confidence.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMArchitect.ai - AI-Driven Decision Intelligence Platform",
    description: "Enable product-facing roles to make architectural and ML model decisions with clarity, speed, and confidence.",
  },
};

// NOTE: SessionProvider from next-auth/react should be used in a client layout, not here, since this is a server component.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
