"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

interface Profile {
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  work_history: string;
  linkedin_url: string;
  skills_tags: string;
  prompt_score: number | null;
  created_at: string;
  testHistory: { testName: string; score: number; completedAt: string; attemptId?: number }[];
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.name) setProfile(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const scoreColor = (s: number) => s >= 80 ? "text-emerald-400" : s >= 65 ? "text-orange-400" : s >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = (s: number) => s >= 80 ? "bg-emerald-500" : s >= 65 ? "bg-orange-400" : s >= 50 ? "bg-amber-500" : "bg-red-500";

  if (loading) {
    return (
      <>
        <Nav transparent />
        <main className="min-h-screen bg-[#111118] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Nav transparent />
        <main className="min-h-screen bg-[#111118] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Profile not found</p>
            <Link href="/" className="text-sm text-orange-400 font-medium">Back to Home</Link>
          </div>
        </main>
      </>
    );
  }

  const skills = profile.skills_tags ? profile.skills_tags.split(",").map(s => s.trim()).filter(Boolean) : [];
  const grade = profile.prompt_score
    ? profile.prompt_score >= 95 ? "S" : profile.prompt_score >= 80 ? "A" : profile.prompt_score >= 65 ? "B" : profile.prompt_score >= 50 ? "C" : profile.prompt_score >= 35 ? "D" : "F"
    : null;

  return (
    <>
      <Nav transparent />
      <main className="min-h-screen bg-[#111118]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-14">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold text-white">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                {profile.bio && <p className="text-sm text-gray-400 mt-1">{profile.bio}</p>}
                <p className="text-xs text-gray-600 mt-1">Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 font-medium mt-1 inline-block">LinkedIn</a>
                )}
              </div>
            </div>

            {profile.prompt_score != null && profile.prompt_score > 0 && (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full border-[3px] flex flex-col items-center justify-center ${profile.prompt_score >= 80 ? "border-emerald-500" : profile.prompt_score >= 65 ? "border-orange-500" : profile.prompt_score >= 50 ? "border-amber-500" : "border-red-500"}`}>
                  <span className={`text-2xl font-extrabold ${scoreColor(profile.prompt_score)}`}>{profile.prompt_score}</span>
                  <span className={`text-[10px] font-semibold ${scoreColor(profile.prompt_score)}`}>{grade}</span>
                </div>
                <div className="text-[10px] text-gray-600 mt-1">PromptScore</div>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-gray-400">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Work History */}
          {profile.work_history && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white mb-3">Work History</h2>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{profile.work_history}</p>
            </div>
          )}

          {/* Assessment History */}
          {profile.testHistory && profile.testHistory.length > 0 && (
            <div className="bg-[#0C1120] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Assessment History</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left py-2.5 px-5 font-medium text-gray-600 text-[11px] uppercase tracking-wider">Assessment</th>
                    <th className="text-center py-2.5 px-4 font-medium text-gray-600 text-[11px] uppercase tracking-wider">Score</th>
                    <th className="text-right py-2.5 px-5 font-medium text-gray-600 text-[11px] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.testHistory.map((test, i) => (
                    <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                      <td className="py-2.5 px-5 font-medium text-white">
                        {test.attemptId ? (
                          <Link href={`/score/${test.attemptId}`} className="hover:text-orange-400 transition-colors">{test.testName}</Link>
                        ) : test.testName}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className={`w-8 h-1.5 rounded-full bg-white/[0.06] overflow-hidden`}>
                            <div className={`h-full rounded-full ${scoreBg(test.score)}`} style={{ width: `${test.score}%` }} />
                          </div>
                          <span className={`text-sm font-bold ${scoreColor(test.score)}`}>{test.score}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-5 text-right text-gray-600">{test.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Verified badge CTA */}
          <div className="mt-10 bg-gradient-to-r from-orange-500/[0.06] to-orange-400/[0.03] rounded-xl border border-orange-500/[0.1] p-6 text-center">
            <h3 className="text-sm font-semibold text-white mb-1">Verified AI Proficiency</h3>
            <p className="text-[13px] text-gray-500 mb-0.5">PromptScore assessments are timed, sandboxed, and monitored.</p>
            <p className="text-[11px] text-gray-600">Scores cannot be faked or self-reported.</p>
          </div>
        </div>
      </main>
    </>
  );
}
