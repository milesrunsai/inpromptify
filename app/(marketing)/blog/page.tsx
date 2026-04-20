import type { Metadata } from "next";
import { BlogContent } from "@/components/marketing/blog-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI assessment, proficiency measurement, and workforce readiness.",
};

export default function BlogPage() {
  return <BlogContent />;
}
