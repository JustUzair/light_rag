import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { font } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
  title: {
    default: "AXIOM | Intelligence Synthesis Engine",
    template: "%s | AXIOM",
  },
  description:
    "A high-performance intelligence synthesis engine powered by LangChain LCEL and LightRAG. Synthesize live web data with Tavily or ingest and query private knowledge bases with zero-noise retrieval.",
  keywords: [
    "AI Synthesis",
    "LangChain LCEL",
    "RAG",
    "LightRAG",
    "Web3 Security Research",
    "Tavily Search",
    "Knowledge Base AI",
  ],
  authors: [{ name: "JustUzair" }],
  creator: "JustUzair",
  openGraph: {
    title: "AXIOM | Intelligence Synthesis Engine", // This fixes the specific error in your screenshot
    description:
      "Multi-mode RAG and Web Synthesis tool for deep intelligence gathering.",
    url: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
    siteName: "AXIOM",
    images: [
      {
        url: "/og-image.png", // Next.js will resolve this to your public folder
        width: 1200,
        height: 630,
        alt: "AXIOM Intelligence Synthesis Engine Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXIOM | Intelligence Synthesis Engine",
    description:
      "Deep-search synthesis and private RAG corpus management via LangChain.",
    creator: "@0xJustUzair", // Replace with your actual handle
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>{children}</body>
    </html>
  );
}
