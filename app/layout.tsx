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
  title: "SpendLens — AI Spend Audit Tool",
  description: "Discover where your team is overpaying for AI tools, what to switch or downgrade, and how much you would save — in under 2 minutes, no login required.",
  keywords: ["AI spend", "SaaS audit", "startup savings", "Cursor pricing", "Copilot vs Cursor", "AI costs"],
  authors: [{ name: "Credex" }],
  openGraph: {
    title: "SpendLens — AI Spend Audit Tool",
    description: "Discover where your team is overpaying for AI tools, what to switch or downgrade, and how much you would save — in under 2 minutes.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
