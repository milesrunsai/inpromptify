"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ds } from "@/lib/designSystem";
import { ROLE_PACKS } from "@/lib/rolePacks";

interface CustomCriterion {
  id: string;
  name: string;
  description: string;
  type: "rubric" | "keyword" | "tone" | "length";
  weight: number;
  config: Record<string, unknown>;
}

interface FormState {
  title: string;
  description: string;
  taskPrompt: string;
  expectedOutcomes: string;
  testType: string;
  difficulty: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  tokenBudget: number;
  model: string;
  scoringWeights: { accuracy: number; efficiency: number; speed: number };
  customCriteria: CustomCriterion[];
  coverImage: string;
  visibility: "public" | "private";
  listingType: "job" | "test" | "casual";
  companyName: string;
  location: string;
  salaryRange: string;
}

const TEMPLATES = [
  ...ROLE_PACKS.map(p => ({ id: p.id, label: p.label, desc: p.desc })),
  { id: "custom", label: "Custom (Blank)", desc: "Start from scratch" },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"];

const PROMPT_TIPS = [
  { pattern: /format|structure/i, tip: "Specifying format helps candidates understand expectations." },
  { pattern: /tone|voice|style/i, tip: "Including tone guidance leads to more consistent scoring." },
  { pattern: /audience|reader/i, tip: "Defining the audience helps candidates tailor their prompts." },
  { pattern: /constraint|limit|avoid/i, tip: "Constraints make the test more challenging and differentiating." },
  { pattern: /example|e\.g\./i, tip: "Including examples helps calibrate candidate expectations." },
];

const GENERIC_TIPS = [
  "Tip: Be specific about the expected output format",
  "Tip: Include constraints to make the test more challenging",
  "Tip: Define who the audience is for better results",
  "Tip: Mention what tone or style you expect",
  "Tip: Add 'must include' and 'must not include' guidelines",
];

const steps = ["Describe", "Configure", "Scoring", "Visibility", "Review"];

export default function CreateTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [aiDescription, setAiDescription] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "", description: "", taskPrompt: "", expectedOutcomes: "",
    testType: "custom", difficulty: "intermediate",
    timeLimitMinutes: 15, maxAttempts: 5, tokenBudget: 2000, model: "gpt-4o",
    scoringWeights: { accuracy: 40, efficiency: 30, speed: 30 },
    customCriteria: [],
    coverImage: "", visibility: "private", listingType: "test",
    companyName: "", location: "", salaryRange: "",
  });

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateWeight = (key: string, value: number) => {
    setForm((prev) => ({ ...prev, scoringWeights: { ...prev.scoringWeights, [key]: value } }));
  };

  const handleAiSuggest = useCallback(async () => {
    if (!aiDescription.trim()) return;
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tests/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: aiDescription.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate suggestion"); return; }
      const s = data.suggestion;
      setForm((prev) => ({
        ...prev,
        title: s.title || prev.title,
        taskPrompt: s.taskPrompt || prev.taskPrompt,
        expectedOutcomes: s.expectedOutcomes || prev.expectedOutcomes,
        timeLimitMinutes: s.timeLimitMinutes || prev.timeLimitMinutes,
        maxAttempts: s.maxAttempts || prev.maxAttempts,
        difficulty: s.difficulty || prev.difficulty,
        model: s.suggestedModel || prev.model,
        scoringWeights: s.scoringWeights || prev.scoringWeights,
        customCriteria: (s.customCriteria || []).map((c: Partial<CustomCriterion>, i: number) => ({
          id: `ai-${i}`, name: c.name || `Criterion ${i + 1}`, description: c.description || "",
          type: c.type || "rubric", weight: c.weight || 25, config: c.config || {},
        })),
        description: aiDescription.trim(),
      }));
      setAiSuggested(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }, [aiDescription]);

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "custom") { setShowTemplates(false); return; }
    const pack = ROLE_PACKS.find((p) => p.id === templateId);
    if (pack) {
      setShowTemplates(false);
      setAiDescription(pack.description);
      setForm((prev) => ({
        ...prev,
        title: pack.title,
        description: pack.description,
        taskPrompt: pack.taskPrompt,
        expectedOutcomes: pack.expectedOutcomes,
        difficulty: pack.difficulty,
        timeLimitMinutes: pack.timeLimitMinutes,
        maxAttempts: pack.maxAttempts,
        tokenBudget: pack.tokenBudget,
        model: pack.model,
        testType: pack.testType,
        scoringWeights: pack.scoringWeights,
        customCriteria: pack.customCriteria,
      }));
      setAiSuggested(true);
    }
  };

  const addCriterion = () => {
    setForm((prev) => ({
      ...prev,
      customCriteria: [...prev.customCriteria, { id: `c-${Date.now()}`, name: "", description: "", type: "rubric", weight: 20, config: {} }],
    }));
  };

  const updateCriterion = (id: string, field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, customCriteria: prev.customCriteria.map((c) => c.id === id ? { ...c, [field]: value } : c) }));
  };

  const updateCriterionConfig = (id: string, key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, customCriteria: prev.customCriteria.map((c) => c.id === id ? { ...c, config: { ...c.config, [key]: value } } : c) }));
  };

  const removeCriterion = (id: string) => {
    setForm((prev) => ({ ...prev, customCriteria: prev.customCriteria.filter((c) => c.id !== id) }));
  };

  const handleTaskPromptChange = (value: string) => {
    update("taskPrompt", value);
    const matched = PROMPT_TIPS.find((t) => t.pattern.test(value));
    if (matched) { setActiveTip(matched.tip); }
    else if (value.length > 20) { setActiveTip(GENERIC_TIPS[Math.floor((value.length / 50) % GENERIC_TIPS.length)]); }
    else { setActiveTip(null); }
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) { if (!form.title.trim() && !aiSuggested) errs.title = "Describe what you want to test, or enter a title"; }
    else if (s === 1) { if (!form.title.trim()) errs.title = "Title is required"; if (!form.taskPrompt.trim()) errs.taskPrompt = "Task prompt is required"; }
    else if (s === 3) { if (form.visibility === "public" && form.listingType === "job" && !form.companyName.trim()) errs.companyName = "Company name is required for job listings"; }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (step === 0) {
      // If they used AI or template, go straight to next step
      if (aiSuggested) { setStep(1); return; }
      // If they typed a description but didn't use AI, carry it forward as the description and go to manual config
      if (aiDescription.trim()) {
        setForm((prev) => ({ ...prev, description: aiDescription.trim() }));
        setStep(1);
        return;
      }
      // Nothing entered at all — let them skip to manual anyway
      setStep(1);
      return;
    }
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async (status: "draft" | "active") => {
    if (!form.title.trim() || !form.taskPrompt.trim()) { setError("Please fill in the title and task prompt."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/tests/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, status }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create test"); setLoading(false); return; }
      router.push(`/dashboard/tests/${data.id}`);
    } catch { setError("Something went wrong. Please try again."); setLoading(false); }
  };

  const modelLabel = form.model === "gpt-4o" ? "GPT-4o" : form.model === "claude" ? "Claude" : "Gemini";
  const weightsTotal = form.scoringWeights.accuracy + form.scoringWeights.efficiency + form.scoringWeights.speed;
  const criteriaWeightTotal = form.customCriteria.reduce((sum, c) => sum + c.weight, 0);
  const listingLabel = form.listingType === "job" ? "Job Listing" : form.listingType === "casual" ? "Casual / Practice" : "Professional Assessment";

  return (
    <div className={`${ds.page} max-w-[800px]`}>
      <div className="mb-10">
        <h1 className={ds.pageTitle}>Create New Test</h1>
        <p className={ds.pageSubtitle}>Test any AI skill. Not just presets.</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <button onClick={() => { if (i < step || validateStep(step)) setStep(i); }}
              className={`flex items-center gap-2 text-[12px] font-medium transition-all duration-200 ${i === step ? "text-indigo-400" : i < step ? "text-emerald-400" : "text-gray-600"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200 ${i === step ? "bg-indigo-600 text-white" : i < step ? "bg-emerald-500 text-white" : "bg-white/[0.06] text-gray-500"}`}>
                {i < step ? (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>) : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className={`flex-1 h-px transition-colors duration-300 ${i < step ? "bg-emerald-500/40" : "bg-white/[0.06]"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3 mb-6">{error}</div>
      )}

      <div className={`${ds.card} p-7`}>
        {/* Step 0: Describe */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className={ds.sectionTitle}>What do you want to test?</h2>
              <p className="text-[13px] text-gray-500 mt-1">Describe the skill or task in plain language. AI will generate a complete test for you in seconds.</p>
            </div>
            <div>
              <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} rows={4}
                className={`${ds.input} resize-none text-[15px] leading-relaxed ${fieldErrors.title ? "border-red-500/40" : ""}`}
                placeholder="e.g., Test candidates on writing professional cold outreach emails for a B2B SaaS company targeting CTOs..." />
              {fieldErrors.title && <p className={ds.inputError}>{fieldErrors.title}</p>}
              <div className="flex items-center justify-between mt-3">
                <button onClick={handleAiSuggest} disabled={aiLoading || !aiDescription.trim()} className={`${ds.btnPrimary} disabled:opacity-50`}>
                  {aiLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Generating...
                    </span>
                  ) : "Generate Test with AI"}
                </button>
                <button onClick={() => setShowTemplates(!showTemplates)} className={ds.btnGhost}>Or start from a template</button>
              </div>
            </div>

            {showTemplates && (
              <div className="border border-white/[0.06] rounded-lg p-4">
                <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-3">Templates</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} onClick={() => handleTemplateSelect(t.id)}
                      className="p-3 rounded-lg border border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] text-left transition-all duration-200">
                      <div className="font-medium text-[12px] text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiSuggested && (
              <div className="border border-indigo-500/20 bg-indigo-500/[0.04] rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-indigo-400">AI Suggestion</h3>
                  <button onClick={() => setStep(1)} className="text-[12px] font-medium text-gray-500 hover:text-gray-300 transition-colors">Customize manually</button>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div><span className="text-gray-500 block text-[11px] uppercase tracking-wider mb-0.5">Title</span><span className="text-white font-medium">{form.title}</span></div>
                  <div><span className="text-gray-500 block text-[11px] uppercase tracking-wider mb-0.5">Task Prompt</span><span className="text-gray-400 whitespace-pre-wrap leading-relaxed">{form.taskPrompt.slice(0, 300)}{form.taskPrompt.length > 300 ? "..." : ""}</span></div>
                  <div className="flex gap-6 text-[12px]">
                    <span><strong className="text-gray-300">Difficulty:</strong> <span className="text-gray-400 capitalize">{form.difficulty}</span></span>
                    <span><strong className="text-gray-300">Time:</strong> <span className="text-gray-400">{form.timeLimitMinutes}m</span></span>
                    <span><strong className="text-gray-300">Attempts:</strong> <span className="text-gray-400">{form.maxAttempts}</span></span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStep(1)} className={ds.btnPrimary}>Use This & Continue</button>
                  <button onClick={() => { setAiSuggested(false); setForm((prev) => ({ ...prev, title: "", taskPrompt: "", expectedOutcomes: "", customCriteria: [] })); }} className={ds.btnSecondary}>Start Over</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Configure */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className={ds.sectionTitle}>Configure Your Test</h2>
            <div>
              <label className={ds.inputLabel}>Test Title *</label>
              <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={`${ds.input} ${fieldErrors.title ? "border-red-500/40" : ""}`} placeholder="e.g., Write a Marketing Email for B2B SaaS" />
              {fieldErrors.title && <p className={ds.inputError}>{fieldErrors.title}</p>}
            </div>
            <div>
              <label className={ds.inputLabel}>Description</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} className={`${ds.input} resize-none`} placeholder="Brief description of what this test evaluates..." />
            </div>
            <div>
              <label className={ds.inputLabel}>Task Prompt * <span className="text-gray-600 font-normal">-- what candidates will see</span></label>
              <textarea value={form.taskPrompt} onChange={(e) => handleTaskPromptChange(e.target.value)} rows={6} className={`${ds.input} resize-none ${fieldErrors.taskPrompt ? "border-red-500/40" : ""}`} placeholder="Describe the task in detail..." />
              {fieldErrors.taskPrompt && <p className={ds.inputError}>{fieldErrors.taskPrompt}</p>}
              {activeTip && <div className="mt-2 text-[12px] text-indigo-400 bg-indigo-500/[0.06] border border-indigo-500/[0.12] rounded-md px-3 py-2">{activeTip}</div>}
            </div>
            <div>
              <label className={ds.inputLabel}>Expected Outcomes</label>
              <p className="text-[11px] text-gray-600 mb-2">What a successful result looks like. Used for scoring.</p>
              <textarea value={form.expectedOutcomes} onChange={(e) => update("expectedOutcomes", e.target.value)} rows={3} className={`${ds.input} resize-none`} placeholder="What does a high-quality output look like?" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={`${ds.inputLabel} mb-2.5`}>Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button key={d} type="button" onClick={() => update("difficulty", d)}
                      className={`px-3 py-1.5 rounded-md text-[12px] font-medium border transition-all duration-200 ${form.difficulty === d ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400" : "border-white/[0.08] text-gray-500 hover:border-white/[0.14]"}`}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`${ds.inputLabel} mb-2.5`}>AI Model</label>
                <div className="flex gap-2">
                  {[{ value: "gpt-4o", name: "GPT-4o" }, { value: "claude", name: "Claude" }, { value: "gemini", name: "Gemini" }].map((m) => (
                    <button key={m.value} type="button" onClick={() => update("model", m.value)}
                      className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium border transition-all duration-200 ${form.model === m.value ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400" : "border-white/[0.08] text-gray-500 hover:border-white/[0.14]"}`}>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Max Attempts", field: "maxAttempts", value: form.maxAttempts, min: 1, max: 20, hint: "Prompts allowed" },
                { label: "Time Limit (min)", field: "timeLimitMinutes", value: form.timeLimitMinutes, min: 1, max: 120, hint: "Total time" },
                { label: "Token Budget", field: "tokenBudget", value: form.tokenBudget, min: 100, max: 50000, step: 500, hint: "All prompts combined" },
              ].map((s) => (
                <div key={s.field}>
                  <label className={ds.inputLabel}>{s.label}</label>
                  <input type="number" value={s.value} onChange={(e) => update(s.field, parseInt(e.target.value) || s.min)} min={s.min} max={s.max} step={s.step} className={ds.input} />
                  <p className="text-[11px] text-gray-600 mt-1">{s.hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Scoring */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className={ds.sectionTitle}>Scoring Configuration</h2>
            <div className="border border-white/[0.06] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-white">Base Scoring Weights</h3>
                <span className={`text-[12px] font-mono ${weightsTotal === 100 ? "text-emerald-400" : "text-amber-400"}`}>{weightsTotal}/100</span>
              </div>
              {weightsTotal !== 100 && <div className="text-[12px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">Weights should sum to 100. Current: {weightsTotal}.</div>}
              <div className="space-y-4">
                {(["accuracy", "efficiency", "speed"] as const).map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[12px] font-medium text-gray-400 capitalize">{key}</label>
                      <span className="text-[12px] font-mono text-gray-500">{form.scoringWeights[key]}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={form.scoringWeights[key]} onChange={(e) => updateWeight(key, parseInt(e.target.value))}
                      className="w-full h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/[0.06] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold text-white">Custom Scoring Criteria</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Define rubric items, keyword requirements, tone checks, and length rules.</p>
                </div>
                <button onClick={addCriterion} className={ds.btnSecondary}>+ Add Criterion</button>
              </div>
              {form.customCriteria.length > 0 && criteriaWeightTotal !== 100 && (
                <div className="text-[12px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">Custom criteria weights should sum to 100. Current: {criteriaWeightTotal}.</div>
              )}
              {form.customCriteria.length === 0 && (
                <div className="text-center py-6 text-[13px] text-gray-500">
                  <p>No custom criteria yet. Add criteria to score responses on your specific requirements.</p>
                  <p className="text-[11px] mt-1 text-gray-600">Tests without custom criteria use the default scoring algorithm.</p>
                </div>
              )}
              <div className="space-y-3">
                {form.customCriteria.map((c, idx) => (
                  <div key={c.id} className="border border-white/[0.06] rounded-lg p-4 space-y-3 bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-[1fr_120px_80px] gap-2">
                          <input type="text" value={c.name} onChange={(e) => updateCriterion(c.id, "name", e.target.value)} className={ds.input} placeholder={`Criterion ${idx + 1} name`} />
                          <select value={c.type} onChange={(e) => updateCriterion(c.id, "type", e.target.value)} className={ds.input}>
                            <option value="rubric">Rubric</option><option value="keyword">Keyword</option><option value="tone">Tone</option><option value="length">Length</option>
                          </select>
                          <div className="relative">
                            <input type="number" value={c.weight} onChange={(e) => updateCriterion(c.id, "weight", Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} className={ds.input} min={0} max={100} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500">%</span>
                          </div>
                        </div>
                        <input type="text" value={c.description} onChange={(e) => updateCriterion(c.id, "description", e.target.value)} className={ds.input} placeholder="Description: what to look for..." />
                        {c.type === "keyword" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-gray-500 mb-0.5 block">Must include (comma-separated)</label><input type="text" value={(c.config.mustInclude as string[] || []).join(", ")} onChange={(e) => updateCriterionConfig(c.id, "mustInclude", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className={ds.input} placeholder="e.g., data privacy, GDPR" /></div>
                            <div><label className="text-[10px] text-gray-500 mb-0.5 block">Must NOT include (comma-separated)</label><input type="text" value={(c.config.mustNotInclude as string[] || []).join(", ")} onChange={(e) => updateCriterionConfig(c.id, "mustNotInclude", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className={ds.input} placeholder="e.g., competitor names" /></div>
                          </div>
                        )}
                        {c.type === "tone" && (
                          <div className="flex gap-2">
                            {["professional", "casual", "technical", "creative"].map((tone) => (
                              <button key={tone} type="button" onClick={() => updateCriterionConfig(c.id, "tone", tone)}
                                className={`px-3 py-1 rounded-md text-[11px] font-medium border transition-all ${c.config.tone === tone ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400" : "border-white/[0.08] text-gray-500"}`}>
                                {tone.charAt(0).toUpperCase() + tone.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                        {c.type === "length" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-gray-500 mb-0.5 block">Min words</label><input type="number" value={(c.config.minWords as number) || ""} onChange={(e) => updateCriterionConfig(c.id, "minWords", parseInt(e.target.value) || 0)} className={ds.input} placeholder="e.g., 100" /></div>
                            <div><label className="text-[10px] text-gray-500 mb-0.5 block">Max words</label><input type="number" value={(c.config.maxWords as number) || ""} onChange={(e) => updateCriterionConfig(c.id, "maxWords", parseInt(e.target.value) || 0)} className={ds.input} placeholder="e.g., 300" /></div>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeCriterion(c.id)} className="text-gray-600 hover:text-red-400 transition-colors mt-1" title="Remove criterion">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Visibility */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className={ds.sectionTitle}>Visibility & Listing</h2>
            <div>
              <label className={`${ds.inputLabel} mb-2.5`}>Visibility</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "private" as const, label: "Private", desc: "Only accessible via direct link." },
                  { value: "public" as const, label: "Public", desc: "Appears in public listings." },
                ].map((v) => (
                  <button key={v.value} type="button" onClick={() => update("visibility", v.value)}
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${form.visibility === v.value ? "border-indigo-500/40 bg-indigo-500/[0.06]" : "border-white/[0.08] hover:border-white/[0.14]"}`}>
                    <span className="font-medium text-[13px] text-white">{v.label}</span>
                    <div className="text-[11px] text-gray-500 mt-1">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {form.visibility === "public" && (
              <>
                <div>
                  <label className={`${ds.inputLabel} mb-2.5`}>Listing Type</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { value: "job" as const, label: "Job", desc: "Real job opening" },
                      { value: "test" as const, label: "Assessment", desc: "Professional test" },
                      { value: "casual" as const, label: "Casual", desc: "Fun / practice" },
                    ].map((t) => (
                      <button key={t.value} type="button" onClick={() => update("listingType", t.value)}
                        className={`p-3.5 rounded-lg border text-left transition-all duration-200 ${form.listingType === t.value ? "border-indigo-500/40 bg-indigo-500/[0.06]" : "border-white/[0.08] hover:border-white/[0.14]"}`}>
                        <span className="font-medium text-[13px] text-white">{t.label}</span>
                        <div className="text-[11px] text-gray-500 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {form.listingType === "job" && (
                  <div className="space-y-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-[13px] font-medium text-white">Job Details</h3>
                    <div>
                      <label className={ds.inputLabel}>Company Name *</label>
                      <input type="text" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className={`${ds.input} ${fieldErrors.companyName ? "border-red-500/40" : ""}`} placeholder="e.g., Acme Corp" />
                      {fieldErrors.companyName && <p className={ds.inputError}>{fieldErrors.companyName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={ds.inputLabel}>Location</label><input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} className={ds.input} placeholder="e.g., Remote" /></div>
                      <div><label className={ds.inputLabel}>Salary Range</label><input type="text" value={form.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} className={ds.input} placeholder="e.g., $80k-$120k" /></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className={ds.sectionTitle}>Review & Publish</h2>
            <div className="space-y-3">
              {[
                { label: "Title", value: form.title || "Untitled" },
                { label: "Difficulty", value: form.difficulty },
                { label: "Visibility", value: form.visibility === "public" ? `Public -- ${listingLabel}` : "Private" },
                ...(form.visibility === "public" && form.listingType === "job" ? [{ label: "Company", value: form.companyName || "--" }, { label: "Location", value: form.location || "--" }, { label: "Salary", value: form.salaryRange || "--" }] : []),
                { label: "Model", value: modelLabel },
                { label: "Time", value: `${form.timeLimitMinutes}m` },
                { label: "Attempts", value: form.maxAttempts.toString() },
                { label: "Token Budget", value: form.tokenBudget.toLocaleString() },
                { label: "Scoring", value: `A:${form.scoringWeights.accuracy} E:${form.scoringWeights.efficiency} S:${form.scoringWeights.speed}` },
                ...(form.customCriteria.length > 0 ? [{ label: "Custom Criteria", value: `${form.customCriteria.length} items` }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-[13px] text-gray-500">{row.label}</span>
                  <span className="text-[13px] text-white capitalize font-medium">{row.value}</span>
                </div>
              ))}
            </div>
            {form.taskPrompt && (
              <div>
                <div className={`${ds.sectionLabel} mb-2`}>Task Prompt</div>
                <div className="bg-white/[0.02] rounded-lg p-4 text-[13px] text-gray-400 whitespace-pre-wrap border border-white/[0.04] leading-relaxed">{form.taskPrompt}</div>
              </div>
            )}
            {form.customCriteria.length > 0 && (
              <div>
                <div className={`${ds.sectionLabel} mb-2`}>Custom Scoring Criteria</div>
                <div className="space-y-2">
                  {form.customCriteria.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-md px-4 py-2.5">
                      <div><span className="text-[13px] font-medium text-white">{c.name || "Unnamed"}</span><span className="text-[11px] text-gray-500 ml-2 capitalize">{c.type}</span></div>
                      <span className="text-[13px] font-mono text-gray-500">{c.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Candidate preview */}
            <div className="border border-dashed border-white/[0.08] rounded-lg p-5">
              <div className={`${ds.sectionLabel} mb-3`}>Candidate Preview</div>
              <h3 className="text-[16px] font-semibold text-white mb-1">{form.title || "Untitled Test"}</h3>
              <p className="text-[13px] text-gray-500 mb-3">{form.description || "No description."}</p>
              <div className="flex flex-wrap gap-4 text-[12px] text-gray-500">
                <span>{modelLabel}</span><span>{form.timeLimitMinutes}m</span><span>{form.maxAttempts} attempts</span><span className="capitalize">{form.difficulty}</span>
                <span className={form.visibility === "public" ? "text-emerald-400" : "text-gray-500"}>{form.visibility === "public" ? "Public" : "Private"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.06]">
          <button onClick={() => setStep(Math.max(0, step - 1))} className={step === 0 ? "invisible" : ds.btnSecondary}>Back</button>
          <div className="flex gap-2.5">
            {step === 0 && !aiSuggested ? (
              <button onClick={goNext} className={ds.btnSecondary}>Skip — build manually</button>
            ) : step < steps.length - 1 ? (
              <button onClick={goNext} className={ds.btnPrimary}>Continue</button>
            ) : (
              <>
                <button onClick={() => handleSubmit("draft")} disabled={loading} className={`${ds.btnSecondary} disabled:opacity-50`}>{loading ? "Saving..." : "Save Draft"}</button>
                <button onClick={() => handleSubmit("active")} disabled={loading}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-md px-4 py-2 text-[13px] font-medium transition-all duration-200">
                  {loading ? "Publishing..." : "Publish Test"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
