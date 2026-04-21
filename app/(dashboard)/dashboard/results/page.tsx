"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, Loader2, Zap } from "lucide-react";

interface DimensionScores {
  [key: string]: number;
}

interface MyAssessment {
  id: string;
  score: number;
  completedAt: string;
  dimensionScores: DimensionScores | null;
  rank: number | null;
}

const DIMENSION_LABELS: Record<string, string> = {
  promptQuality: "Prompt Quality",
  efficiency: "Efficiency",
  speed: "Speed",
  responseQuality: "Response Quality",
  iterationIntelligence: "Iteration Intelligence",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-orange-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-500";
}

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export default function MyResultsPage() {
  const [assessments, setAssessments] = useState<MyAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/my-results");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAssessments(data.assessments ?? []);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Results
          </h1>
          <p className="text-sm text-gray-500">
            Your AI proficiency assessment history.
          </p>
        </div>
        <Card className="border-gray-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50">
              <BarChart3 className="size-7 text-orange-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No results yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Take the AI Proficiency Assessment to see your PromptScore and
              dimension breakdown here.
            </p>
            <Link
              href="/assess"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              <Zap className="size-4" />
              Take Assessment
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Results
        </h1>
        <p className="text-sm text-gray-500">
          Your AI proficiency assessment history.
        </p>
      </div>

      {assessments.map((a, idx) => {
        const dims = a.dimensionScores ?? {};
        const dimEntries = Object.entries(dims);

        return (
          <Card key={a.id} className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">
                    {idx === 0 ? "Latest Assessment" : `Assessment ${assessments.length - idx}`}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Completed{" "}
                    {new Date(a.completedAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {a.rank && (
                      <span className="ml-2">
                        &middot; Rank #{a.rank} globally
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">PromptScore</p>
                  <p
                    className={cn(
                      "text-3xl font-bold tabular-nums",
                      scoreColor(a.score)
                    )}
                  >
                    {a.score}%
                  </p>
                </div>
              </div>
            </CardHeader>
            {dimEntries.length > 0 && (
              <CardContent>
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Dimension Breakdown
                </h4>
                <div className="space-y-3">
                  {dimEntries.map(([key, val]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {DIMENSION_LABELS[key] ?? key}
                        </span>
                        <span className="font-medium text-gray-900 tabular-nums">
                          {val}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn("h-full rounded-full", barColor(val))}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Retake CTA */}
      <Link href="/assess" className="block">
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 py-4">
            <Zap className="size-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-900">
              Retake the Assessment to improve your score
            </span>
            <ArrowRight className="ml-auto size-4 text-gray-400" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
