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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  title: {
    default: "AI Skills Assessment Platform for Enterprise Hiring | InpromptiFy",
    template: "%s | InpromptiFy",
  },
  description:
    "Enterprise AI competency assessment platform. Screen candidates and upskill teams with standardized AI proficiency testing. Used by leading tech companies for hiring and workforce development.",
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
    title: "AI Skills Assessment Platform for Enterprise Hiring | InpromptiFy",
    description: "Screen AI talent and assess workforce competency with our enterprise assessment platform. Standardized testing for prompt engineering, model selection, and AI implementation skills.",
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
    title: "AI Skills Assessment Platform for Enterprise | InpromptiFy",
    description: "Enterprise AI competency testing for hiring and workforce development. Standardized assessments for AI skills evaluation.",
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
          href="/hero-bg.mp4"
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
