import { Metadata } from "next";
import { getSql } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ hash: string }> }): Promise<Metadata> {
  try {
    const { hash } = await params;
    const sql = getSql();

    const rows = await sql`
      SELECT user_name, score, letter_grade, percentile
      FROM score_verifications
      WHERE hash = ${hash}
    `;

    if (rows.length === 0) {
      return {
        title: "Verification Not Found — InpromptiFy",
        description: "This verification badge could not be found.",
      };
    }

    const { user_name, score, letter_grade, percentile } = rows[0];
    const certTier = score >= 80 ? "Expert" : score >= 65 ? "Proficient" : score >= 50 ? "Foundational" : null;
    const certText = certTier ? ` — ${certTier} Tier Certified` : "";

    return {
      title: `${user_name} — PromptScore ${score}/100 (${letter_grade})${certText}`,
      description: `${user_name} scored ${score}/100 on the PromptScore AI proficiency assessment, better than ${percentile}% of test takers.${certText ? ` Certified at ${certTier} tier.` : ""}`,
      openGraph: {
        title: `${user_name} — PromptScore ${score}/100`,
        description: `Scored ${letter_grade} (better than ${percentile}% of candidates)${certText}`,
        url: `https://inpromptify.com/verify/${hash}`,
        siteName: "InpromptiFy",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${user_name} — PromptScore ${score}/100`,
        description: `Scored ${letter_grade} (better than ${percentile}% of candidates)${certText}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Verified PromptScore — InpromptiFy",
      description: "View this verified PromptScore AI proficiency assessment.",
    };
  }
}

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
