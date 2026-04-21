"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TestThumbnail from "@/components/TestThumbnail";
import { PublicTest } from "@/components/PublicTestCard";

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  salary_range: string;
  required_score: number;
  test_id: number | null;
  test_title: string | null;
  created_at: string;
}

export default function JobsPage() {
  const [legacyJobs, setLegacyJobs] = useState<Job[]>([]);
  const [testJobs, setTestJobs] = useState<PublicTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()).catch(() => []),
      fetch("/api/tests/public?listing_type=job").then((r) => r.json()).catch(() => []),
    ]).then(([jobs, tests]) => {
      if (Array.isArray(jobs)) setLegacyJobs(jobs);
      if (Array.isArray(tests)) setTestJobs(tests);
    }).finally(() => setLoading(false));
  }, []);

  const hasContent = legacyJobs.length > 0 || testJobs.length > 0;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#111118]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 pt-28 pb-14">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white">Open Roles</h1>
            <p className="text-sm text-gray-500 mt-1">Apply by completing a prompting assessment</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading jobs...</div>
          ) : !hasContent ? (
            <div className="bg-[#0C1120] rounded-lg border border-white/[0.06] px-5 py-16 text-center">
              <div className="text-3xl mb-3">💼</div>
              <p className="text-gray-400 text-sm mb-2">No open roles at the moment</p>
              <p className="text-xs text-gray-300">Check back soon — employers are adding new listings regularly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tests with listing_type=job */}
              {testJobs.map((test) => (
                <div key={`test-${test.id}`} className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 shrink-0 hidden sm:block">
                        {test.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={test.cover_image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                        ) : (
                          <TestThumbnail
                            title={test.title}
                            listingType="job"
                            difficulty={test.difficulty}
                            model={test.model}
                            variant="thumb"
                            className="w-14 h-14 !rounded-lg"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white">{test.title}</h2>
                        {test.company_name && <p className="text-sm text-orange-500 font-medium mt-0.5">{test.company_name}</p>}
                        {test.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{test.description}</p>}
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                          {test.location && <span>📍 {test.location}</span>}
                          {test.salary_range && <span>💰 {test.salary_range}</span>}
                          <span>👥 {test.candidates_count} applicants</span>
                          <span>Posted {new Date(test.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/test/${test.id}`}
                      className="shrink-0 ml-4 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Legacy jobs from jobs table */}
              {legacyJobs.map((job) => (
                <div key={`job-${job.id}`} className="bg-[#0C1120] rounded-lg border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                      <p className="text-sm text-orange-500 font-medium mt-0.5">{job.company}</p>
                      {job.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                        {job.location && <span>📍 {job.location}</span>}
                        {job.salary_range && <span>💰 {job.salary_range}</span>}
                        {job.required_score > 0 && <span>🎯 Min PromptScore: {job.required_score}</span>}
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {job.test_id && (
                      <Link
                        href={`/test/${job.test_id}`}
                        className="shrink-0 ml-4 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Apply →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
