"use client";

import { useCallback, useEffect, useState } from "react";
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
  Clock,
  Loader2,
  Mail,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

/* ---------- types ---------- */
interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
  avatarUrl?: string | null;
}

interface PendingInvite {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  invitedAt: string;
  status: string;
}

interface TeamResponse {
  members: TeamMember[];
  invites: PendingInvite[];
}

/* ---------- helpers ---------- */
function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email[0]?.toUpperCase() ?? "?";
}

/* ---------- component ---------- */
export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);

  /* invite modal */
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  /* role change dropdown per member */
  const [openRoleMenuId, setOpenRoleMenuId] = useState<string | null>(null);

  /* fetch team */
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error();
      const data: TeamResponse = await res.json();
      setMembers(data.members ?? []);
      setInvites(data.invites ?? []);
    } catch {
      setMembers([]);
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  /* invite member */
  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send invite");
      }
      setInviteEmail("");
      setInviteRole("MEMBER");
      setShowInviteModal(false);
      fetchTeam();
    } catch (err: unknown) {
      setInviteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setInviting(false);
    }
  };

  /* change role */
  const handleRoleChange = async (memberId: string, newRole: "ADMIN" | "MEMBER") => {
    setOpenRoleMenuId(null);
    try {
      await fetch(`/api/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch {
      /* silently fail */
    }
  };

  /* remove member */
  const handleRemove = async (memberId: string) => {
    try {
      await fetch(`/api/team/${memberId}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch {
      /* silently fail */
    }
  };

  /* cancel invite */
  const handleCancelInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/team/invites/${inviteId}`, { method: "DELETE" });
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Team</h1>
          <p className="text-sm text-white/50">
            Manage team members and their roles.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowInviteModal(true)}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          <UserPlus className="mr-1.5 size-4" />
          Invite Member
        </Button>
      </div>

      {/* Members */}
      <Card className="border-white/[0.08] bg-[#141414]">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
          <CardDescription className="text-white/50">
            People in your organization who can create and view assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-4"
                >
                  <div className="size-10 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-3 w-56 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                  <div className="h-5 w-16 animate-pulse rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/[0.05]">
                <Users className="size-7 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white">
                No team members yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-white/50">
                Invite team members to collaborate on assessments and view results.
              </p>
              <Button
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="mt-6 bg-orange-500 text-white hover:bg-orange-600"
              >
                <UserPlus className="mr-1.5 size-4" />
                Invite Member
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-sm font-medium text-orange-400">
                      {getInitials(member.name, member.email)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {member.name || member.email}
                      </p>
                      <p className="text-xs text-white/50">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="hidden text-xs text-white/30 sm:block">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>

                    {/* Role dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenRoleMenuId(
                            openRoleMenuId === member.id ? null : member.id
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
                          member.role === "ADMIN"
                            ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                            : "border-white/[0.1] bg-white/[0.05] text-white/60"
                        )}
                      >
                        {member.role === "ADMIN" ? "Admin" : "Member"}
                        <ChevronDown className="size-3" />
                      </button>
                      {openRoleMenuId === member.id && (
                        <div className="absolute right-0 top-full z-40 mt-1 w-32 rounded-lg border border-white/[0.08] bg-[#141414] py-1 shadow-xl">
                          <button
                            onClick={() => handleRoleChange(member.id, "ADMIN")}
                            className={cn(
                              "flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.06]",
                              member.role === "ADMIN"
                                ? "text-orange-400"
                                : "text-white/70"
                            )}
                          >
                            Admin
                          </button>
                          <button
                            onClick={() => handleRoleChange(member.id, "MEMBER")}
                            className={cn(
                              "flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.06]",
                              member.role === "MEMBER"
                                ? "text-orange-400"
                                : "text-white/70"
                            )}
                          >
                            Member
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemove(member.id)}
                      className="flex size-7 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Remove member"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {!loading && invites.length > 0 && (
        <Card className="border-white/[0.08] bg-[#141414]">
          <CardHeader>
            <CardTitle className="text-white">Pending Invites</CardTitle>
            <CardDescription className="text-white/50">
              Invitations that have been sent but not yet accepted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/[0.05] text-white/30">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {invite.email}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Clock className="size-3" />
                        Invited{" "}
                        {new Date(invite.invitedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      )}
                    >
                      {invite.status || "Pending"}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        invite.role === "ADMIN"
                          ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                          : "border-white/[0.1] bg-white/[0.05] text-white/60"
                      )}
                    >
                      {invite.role === "ADMIN" ? "Admin" : "Member"}
                    </span>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      className="flex size-7 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Cancel invite"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-[#141414] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Invite Team Member
              </h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteError("");
                  setInviteEmail("");
                  setInviteRole("MEMBER");
                }}
                className="flex size-8 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-white/50">
              Send an invitation to join your organization.
            </p>

            <div className="mt-5 space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInvite();
                    }
                  }}
                  className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Role
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown((v) => !v)}
                    className="flex h-8 w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white/70 transition-colors hover:bg-white/[0.06]"
                  >
                    <span>{inviteRole === "ADMIN" ? "Admin" : "Member"}</span>
                    <ChevronDown className="size-3.5" />
                  </button>
                  {showRoleDropdown && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-xl">
                      <button
                        onClick={() => {
                          setInviteRole("ADMIN");
                          setShowRoleDropdown(false);
                        }}
                        className={cn(
                          "flex w-full flex-col px-3 py-2 text-left transition-colors hover:bg-white/[0.06]",
                          inviteRole === "ADMIN"
                            ? "text-orange-400"
                            : "text-white/70"
                        )}
                      >
                        <span className="text-sm font-medium">Admin</span>
                        <span className="text-xs text-white/40">
                          Can manage team, assessments, and billing
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setInviteRole("MEMBER");
                          setShowRoleDropdown(false);
                        }}
                        className={cn(
                          "flex w-full flex-col px-3 py-2 text-left transition-colors hover:bg-white/[0.06]",
                          inviteRole === "MEMBER"
                            ? "text-orange-400"
                            : "text-white/70"
                        )}
                      >
                        <span className="text-sm font-medium">Member</span>
                        <span className="text-xs text-white/40">
                          Can create and view assessments
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {inviteError && (
                <p className="text-sm text-red-400">{inviteError}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteError("");
                    setInviteEmail("");
                    setInviteRole("MEMBER");
                  }}
                  className="border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {inviting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
