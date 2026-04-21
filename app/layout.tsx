import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/posthog-provider";
import { ConsentBanner } from "@/components/consent-banner";
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
  title: {
    default: "Inpromptify — AI Proficiency Assessment",
    template: "%s | Inpromptify",
  },
  description:
    "Adaptive AI proficiency assessments for hiring and upskilling. Measure real AI fluency with PromptScore.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Inpromptify — AI Proficiency Assessment",
    description: "Measure real AI proficiency. Not AI trivia. Take the free 3-minute assessment and get your PromptScore.",
    url: "https://inpromptify.com",
    siteName: "Inpromptify",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inpromptify — AI Proficiency Assessment",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inpromptify — AI Proficiency Assessment",
    description: "Measure real AI proficiency. Not AI trivia. Get your PromptScore in 3 minutes.",
    images: ["/og-image.png"],
    site: "@Inpromptify",
    creator: "@Inpromptify",
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
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="https://d8j0ntlcm91z4.cloudfront.net/user_3CVjpU5MqL28kt1M6PyOAXhNcyX/hf_20260420_060720_7b600b45-de92-47e3-b11c-619fab9fc4c5.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <Suspense fallback={null}>
          <PostHogProvider>
            {children}
            <ConsentBanner />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
