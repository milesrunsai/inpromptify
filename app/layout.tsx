import type { Metadata } from "next";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
    default: "InpromptiFy — AI Proficiency Assessment",
    template: "%s | InpromptiFy",
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
    title: "InpromptiFy — AI Proficiency Assessment",
    description: "Measure real AI proficiency. Not AI trivia. Take the free 3-minute assessment and get your PromptScore.",
    url: "https://inpromptify.com",
    siteName: "InpromptiFy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InpromptiFy — AI Proficiency Assessment",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InpromptiFy — AI Proficiency Assessment",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <ClerkProvider
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "oklch(0.7 0.18 50)",
              colorBackground: "oklch(0.14 0.005 250)",
              colorInputBackground: "oklch(0.1 0.005 250)",
              colorInputText: "oklch(0.95 0 0)",
            },
          }}
        >
          <Suspense fallback={null}>
            <PostHogProvider>
              {children}
              <ConsentBanner />
            </PostHogProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
