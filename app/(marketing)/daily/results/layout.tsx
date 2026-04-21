import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; date?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const score = parseInt(params.score || "0", 10);
  const date = params.date || new Date().toISOString().slice(0, 10);
  const ogImageUrl = `https://inpromptify.com/api/og/daily?score=${score}&date=${date}`;

  return {
    title: `I scored ${score}/5 — Daily AI Challenge`,
    description: `Can you beat ${score}/5? Take the free Inpromptify Daily AI Challenge.`,
    openGraph: {
      title: `I scored ${score}/5 — Inpromptify Daily AI Challenge`,
      description: `Can you beat ${score}/5? Take the free daily AI challenge at inpromptify.com/daily`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `Score: ${score}/5` }],
      type: "website",
      url: `https://inpromptify.com/daily/results?score=${score}&date=${date}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `I scored ${score}/5 — Inpromptify Daily AI Challenge`,
      description: `Can you beat ${score}/5? Take the free daily AI challenge.`,
      images: [ogImageUrl],
    },
  };
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
