"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type QuestionOption = { id: string; text: string; isCorrect: boolean };

interface PendingQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  difficulty: number;
  dimensions: string[];
  tags: string[];
  maxTimeSeconds: number;
  source: string;
  status: string;
  reviewedBy: string | null;
  createdAt: string;
}

interface ActiveQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  difficulty: number;
  dimensions: string[];
  tags: string[];
  maxTimeSeconds: number;
  isActive: boolean;
  irtA: number | null;
  irtB: number | null;
  irtC: number | null;
  createdAt: string;
}

type Tab = "active" | "pending" | "rejected";

const DIMENSIONS = [
  "promptQuality",
  "efficiency",
  "speed",
  "responseQuality",
  "iterationIntelligence",
];

function EmptyOption(): QuestionOption {
  return { id: "", text: "", isCorrect: false };
}

function QuestionCard({
  question,
  tab,
  onAction,
  expanded,
  onToggle,
}: {
  question: PendingQuestion | ActiveQuestion;
  tab: Tab;
  onAction: (action: string, id: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const dims = (question.dimensions as string[]) || [];
  return (
    <Card>
      <CardHeader
        className="cursor-pointer flex flex-row items-start justify-between gap-4"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm leading-relaxed line-clamp-2">
            {question.text}
          </CardTitle>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary">Diff: {question.difficulty}</Badge>
            <Badge variant="secondary">{question.maxTimeSeconds}s</Badge>
            {"source" in question && (
              <Badge variant="outline">{question.source}</Badge>
            )}
            {dims.map((d) => (
              <Badge key={d} variant="outline" className="text-xs">
                {d}
              </Badge>
            ))}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        )}
      </CardHeader>
      {expanded && (
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            {(question.options as QuestionOption[]).map((opt) => (
              <div
                key={opt.id}
                className={`rounded-md border p-3 text-sm ${
                  opt.id === question.correctOptionId
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-border"
                }`}
              >
                <span className="font-medium mr-2">{opt.id}.</span>
                {opt.text}
                {opt.id === question.correctOptionId && (
                  <Badge className="ml-2 bg-green-600 text-xs">Correct</Badge>
                )}
              </div>
            ))}
          </div>
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {"irtA" in question && question.irtA != null && (
            <div className="text-xs text-muted-foreground">
              IRT params: a={question.irtA?.toFixed(2)} b=
              {question.irtB?.toFixed(2)} c={question.irtC?.toFixed(2)}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            {tab === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAction("approve", question.id)}
                >
                  <CheckCircle className="mr-1 size-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onAction("reject", question.id)}
                >
                  <XCircle className="mr-1 size-3.5" />
                  Reject
                </Button>
              </>
            )}
            {tab === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("deactivate", question.id)}
              >
                Deactivate
              </Button>
            )}
            {tab === "rejected" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("approve", question.id)}
              >
                Re-approve
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminQuestionsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [questions, setQuestions] = useState<(PendingQuestion | ActiveQuestion)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [newText, setNewText] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(50);
  const [newMaxTime, setNewMaxTime] = useState(45);
  const [newDimensions, setNewDimensions] = useState<string[]>([]);
  const [newTags, setNewTags] = useState("");
  const [newOptions, setNewOptions] = useState<QuestionOption[]>([
    { id: "A", text: "", isCorrect: true },
    { id: "B", text: "", isCorrect: false },
    { id: "C", text: "", isCorrect: false },
    { id: "D", text: "", isCorrect: false },
  ]);
  const [creating, setCreating] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/questions?tab=${tab}&search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setQuestions(data.questions);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  async function handleAction(action: string, id: string) {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Action failed");
      }
      fetchQuestions();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const correctOption = newOptions.find((o) => o.isCorrect);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newText,
          options: newOptions,
          correctOptionId: correctOption?.id ?? "A",
          difficulty: newDifficulty,
          dimensions: newDimensions,
          tags: newTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          maxTimeSeconds: newMaxTime,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Create failed");
      }
      setShowCreate(false);
      setNewText("");
      setNewDimensions([]);
      setNewTags("");
      setNewOptions([
        { id: "A", text: "", isCorrect: true },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ]);
      fetchQuestions();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "active", label: "Active", icon: <CheckCircle className="size-3.5" /> },
    { key: "pending", label: "Pending", icon: <Clock className="size-3.5" /> },
    { key: "rejected", label: "Rejected", icon: <XCircle className="size-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Question Management
          </h1>
          <p className="text-muted-foreground">
            Review, approve, and manage assessment questions.
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-1 size-4" />
          Add Question
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New Question</CardTitle>
            <CardDescription>
              Create a new pending question for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Question Text</Label>
                <textarea
                  className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                  placeholder="Enter the question text..."
                />
              </div>
              <div className="grid gap-3">
                <Label>Options (mark one as correct)</Label>
                {newOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="font-medium text-sm w-6">{opt.id}.</span>
                    <Input
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[idx] = { ...opt, text: e.target.value };
                        setNewOptions(updated);
                      }}
                      placeholder={`Option ${opt.id}`}
                      required
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="correct"
                        checked={opt.isCorrect}
                        onChange={() => {
                          setNewOptions(
                            newOptions.map((o) => ({
                              ...o,
                              isCorrect: o.id === opt.id,
                            }))
                          );
                        }}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Difficulty (1-100)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Max Time (seconds)</Label>
                  <Input
                    type="number"
                    min={10}
                    max={120}
                    value={newMaxTime}
                    onChange={(e) => setNewMaxTime(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Dimensions</Label>
                <div className="flex flex-wrap gap-2">
                  {DIMENSIONS.map((d) => (
                    <label
                      key={d}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs cursor-pointer transition-colors ${
                        newDimensions.includes(d)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={newDimensions.includes(d)}
                        onChange={() => {
                          setNewDimensions((prev) =>
                            prev.includes(d)
                              ? prev.filter((x) => x !== d)
                              : [...prev, d]
                          );
                        }}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="prompt-engineering, iteration, debugging"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-1 size-4 animate-spin" />}
                  Create Question
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="text-lg font-medium">No {tab} questions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "pending"
                ? "No questions awaiting review."
                : tab === "rejected"
                  ? "No rejected questions."
                  : "No active questions in the bank."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              tab={tab}
              onAction={handleAction}
              expanded={expandedId === q.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === q.id ? null : q.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
