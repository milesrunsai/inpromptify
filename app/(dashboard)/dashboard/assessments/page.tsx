"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  Loader2,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

/* ---------- types ---------- */
interface DimensionScore {
  dimension: string;
  score: number;
}

interface Assessment {
  id: string;
  candidateEmail: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  createdAt: string;
  dimensions?: DimensionScore[];
  responses?: { question: string; answer: string }[];
}

interface AssessmentsResponse {
  assessments: Assessment[];
  total: number;
  page: number;
  totalPages: number;
}

/* ---------- constants ---------- */
const STATUS_OPTIONS = ["All", "PENDING", "IN_PROGRESS", "COMPLETED"] as const;
const LIMIT = 20;

const statusBadgeClass: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  PENDING: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

/* ---------- component ---------- */
export default function AssessmentsPage() {
  /* data state */
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  /* filter state */
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* detail expansion */
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* modal state */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  /* status dropdown */
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  /* debounce search */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  /* fetch assessments */
  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/assessments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: AssessmentsResponse = await res.json();
      setAssessments(data.assessments ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  /* create assessment */
  const handleCreate = async () => {
    if (!newEmail.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateEmail: newEmail.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create assessment");
      }
      setNewEmail("");
      setShowCreateModal(false);
      fetchAssessments();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  /* export csv */
  const handleExport = async () => {
    try {
      const res = await fetch("/api/export?format=csv");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "assessments.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* silently fail */
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Assessments
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage AI proficiency assessments for your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Download className="mr-1.5 size-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="mr-1.5 size-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown((v) => !v)}
            className="flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            <span>{statusFilter === "All" ? "All Statuses" : statusLabel[statusFilter]}</span>
            <ChevronDown className="size-3.5" />
          </button>
          {showStatusDropdown && (
            <div className="absolute left-0 top-full z-40 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                    setShowStatusDropdown(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-gray-100",
                    statusFilter === s
                      ? "text-orange-400"
                      : "text-gray-600"
                  )}
                >
                  {s === "All" ? "All Statuses" : statusLabel[s]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-gray-200 bg-gray-50 pl-8 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">All Assessments</CardTitle>
          <CardDescription className="text-gray-500">
            {total} assessment{total !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            /* Skeleton loader */
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : assessments.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
                <Send className="size-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No assessments found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {debouncedSearch || statusFilter !== "All"
                  ? "Try adjusting your filters or search query."
                  : "Send an assessment link to a candidate to start measuring their AI proficiency."}
              </p>
              {!debouncedSearch && statusFilter === "All" && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-6 bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Plus className="mr-1.5 size-4" />
                  Create Assessment
                </Button>
              )}
            </div>
          ) : (
            /* Table rows */
            <div className="space-y-2">
              {/* Header row */}
              <div className="hidden items-center gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400 sm:grid sm:grid-cols-[1fr_100px_80px_120px_60px]">
                <span>Candidate</span>
                <span>Status</span>
                <span>Score</span>
                <span>Created</span>
                <span />
              </div>

              {assessments.map((a) => (
                <div key={a.id}>
                  <div
                    className={cn(
                      "grid items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 sm:grid-cols-[1fr_100px_80px_120px_60px]",
                      expandedId === a.id && "rounded-b-none border-b-0"
                    )}
                  >
                    <p className="truncate text-sm font-medium text-gray-900">
                      {a.candidateEmail}
                    </p>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          statusBadgeClass[a.status]
                        )}
                      >
                        {statusLabel[a.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {a.score != null ? `${a.score}%` : "--"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === a.id ? null : a.id)
                      }
                      className="flex size-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      title="View details"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {expandedId === a.id && (
                    <div className="rounded-b-lg border border-t-0 border-gray-200 bg-gray-50 p-4">
                      {a.dimensions && a.dimensions.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Dimension Scores
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {a.dimensions.map((d) => (
                              <div
                                key={d.dimension}
                                className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                              >
                                <p className="text-xs text-gray-500">
                                  {d.dimension}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                  {d.score}%
                                </p>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full bg-orange-500"
                                    style={{ width: `${d.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No detailed scores available yet.
                        </p>
                      )}

                      {a.responses && a.responses.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Responses
                          </h4>
                          {a.responses.map((r, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                            >
                              <p className="text-xs font-medium text-gray-500">
                                Q: {r.question}
                              </p>
                              <p className="mt-1 text-sm text-gray-700">
                                {r.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30"
            >
              <ChevronLeft className="mr-1 size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Create Assessment
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateError("");
                  setNewEmail("");
                }}
                className="flex size-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Send an assessment invitation to a candidate.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">
                  Candidate Email
                </label>
                <Input
                  type="email"
                  placeholder="candidate@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreate();
                    }
                  }}
                  className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {createError && (
                <p className="text-sm text-red-400">{createError}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                    setNewEmail("");
                  }}
                  className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={creating || !newEmail.trim()}
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {creating && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
