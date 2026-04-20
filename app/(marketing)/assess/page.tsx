import type { Metadata } from "next";
import { AssessmentFlow } from "./assessment-flow";

export const metadata: Metadata = {
  title: "Take the Assessment",
  description:
    "Take a free 3-minute AI proficiency assessment and get your PromptScore.",
};

export default function AssessPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <AssessmentFlow />
    </main>
  );
}
