import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
  title: {
    default: "InpromptiFy — AI Proficiency Assessment",
    template: "%s | InpromptiFy",
  },
  description:
    "Adaptive AI proficiency assessments for hiring and upskilling. Measure real AI fluency with PromptScore.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
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
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
