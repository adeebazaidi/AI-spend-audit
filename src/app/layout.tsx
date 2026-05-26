import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spendwise.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spendwise AI — Free AI Spend Audit for Startups",
    template: "%s | Spendwise AI",
  },
  description:
    "Stop overpaying for AI tools. Spendwise AI runs a free, deterministic audit across Cursor, Claude, ChatGPT, GitHub Copilot & more — and tells you exactly where to cut costs.",
  keywords: [
    "AI spend audit",
    "SaaS cost optimization",
    "Cursor vs Copilot",
    "startup tooling costs",
    "AI tooling",
    "reduce AI spend",
  ],
  authors: [{ name: "Spendwise AI" }],
  creator: "Spendwise AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Spendwise AI",
    title: "Spendwise AI — Free AI Spend Audit for Startups",
    description:
      "Startups waste 42% on redundant AI tooling. Run a free, deterministic audit and see exactly where you can cut costs today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spendwise AI — Free AI Spend Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spendwise AI — Free AI Spend Audit",
    description:
      "Startups waste 42% on redundant AI tooling. Find out exactly where yours is in 3 minutes.",
    images: ["/og-image.png"],
    creator: "@spendwiseai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
