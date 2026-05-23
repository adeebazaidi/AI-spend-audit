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
  title: "Spendwise AI | AI Spend Audit",
  description: "Identify overspending on AI tools like Cursor, Claude, and ChatGPT and get deterministic savings recommendations.",
  openGraph: {
    title: "Spendwise AI | AI Spend Audit",
    description: "Identify overspending on AI tools like Cursor, Claude, and ChatGPT and get deterministic savings recommendations.",
  },
  twitter: {
    card: "summary_large_image",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">{children}</body>
    </html>
  );
}
