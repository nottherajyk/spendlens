import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendLens — AI Spend Audit Tool",
  description: "Discover where your team is overpaying for AI tools, what to switch or downgrade, and how much you would save — in under 2 minutes, no login required.",
  keywords: ["AI spend", "SaaS audit", "startup savings", "Cursor pricing", "Copilot vs Cursor", "AI costs"],
  authors: [{ name: "Credex" }],
  icons: {
    icon: "/logo.ico",
  },
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-emerald-700/20 selection:text-emerald-900 font-sans">
        {children}
      </body>
    </html>
  );
}
