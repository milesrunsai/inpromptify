import type { Metadata } from "next";
import { AssessmentFlow } from "./assessment-flow";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Take the Assessment",
  description:
    "Take a free 3-minute AI proficiency assessment and get your PromptScore.",
};

export default async function AssessPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-12">
      <AssessmentFlow
        initialEmail={user?.email || undefined}
        initialName={user?.name || undefined}
        autoStart={!!user}
      />
    </main>
  );
}
