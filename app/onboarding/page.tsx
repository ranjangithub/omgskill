"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { INDUSTRIES, ROLES, CONTENT_GOALS } from "@/lib/personas/taxonomy";

const VOICES = [
  { id: "analytical",     label: "Analytical & Direct",   desc: "Data-first, no fluff. Precise and technical." },
  { id: "conversational", label: "Conversational",         desc: "Approachable and easy to share with anyone." },
  { id: "executive",      label: "Executive Summary",      desc: "Short and decisive. Built for fast readers." },
] as const;

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const [autoLabel, setAutoLabel] = useState("");
  const [profile, setProfile] = useState({
    industry: "",
    role: "",
    contentGoals: [] as string[],
    voicePreference: "analytical" as "analytical" | "conversational" | "executive",
    linkedinUrl: "",
    inspirations: "",
    currentProjects: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("omgskill_preauth");
    if (!stored) return;
    let preauth: { industry?: string; role?: string; contentGoals?: string[] };
    try { preauth = JSON.parse(stored); } catch { return; }
    localStorage.removeItem("omgskill_preauth");

    const ind = INDUSTRIES.find((i) => i.id === preauth.industry);
    const rol = ROLES.find((r) => r.id === preauth.role);
    if (ind && rol) setAutoLabel(`${ind.emoji} ${ind.label} × ${rol.emoji} ${rol.label}`);
    setAutoSubmitting(true);

    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        industry: preauth.industry ?? "technology-saas",
        role: preauth.role ?? "technology",
        contentGoals: preauth.contentGoals?.length ? preauth.contentGoals : ["stay-updated"],
        voicePreference: "analytical",
        linkedinUrl: null,
        inspirations: null,
        currentProjects: null,
      }),
    })
      .then(() => router.push("/dashboard"))
      .catch(() => setAutoSubmitting(false));
  }, [router]);

  function toggleGoal(id: string) {
    setProfile((p) => {
      const has = p.contentGoals.includes(id);
      if (has) return { ...p, contentGoals: p.contentGoals.filter((g) => g !== id) };
      if (p.contentGoals.length >= 3) return p; // max 3
      return { ...p, contentGoals: [...p.contentGoals, id] };
    });
  }

  async function finish() {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    router.push("/dashboard");
  }

  const industryObj = INDUSTRIES.find((i) => i.id === profile.industry);
  const roleObj = ROLES.find((r) => r.id === profile.role);

  if (autoSubmitting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white px-6">
        <div className="text-center max-w-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 mx-auto animate-pulse">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-3">Personalizing your briefing...</h1>
          {autoLabel && <p className="text-sm text-slate-400">{autoLabel}</p>}
          <p className="mt-2 text-xs text-slate-600">Taking you to your dashboard in a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-white">omgskill<span className="text-indigo-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i + 1 <= step ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-start px-6 py-10">
        <div className="w-full max-w-xl">

          {/* ── Step 1 — Industry ── */}
          {step === 1 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 1 of {TOTAL_STEPS} — Industry</p>
              <h1 className="mb-2 text-3xl font-black">What industry are you in?</h1>
              <p className="mb-8 text-slate-400">Signals get filtered and framed for your sector.</p>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button key={ind.id} onClick={() => setProfile((p) => ({ ...p, industry: ind.id }))}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${profile.industry === ind.id ? "border-indigo-500 bg-indigo-600" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
                    <span className="text-xl">{ind.emoji}</span>
                    <span className="text-sm font-semibold leading-tight">{ind.label}</span>
                  </button>
                ))}
              </div>
              <button disabled={!profile.industry} onClick={() => setStep(2)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Step 2 — Role ── */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="h-3 w-3" /> {industryObj?.emoji} {industryObj?.label}
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 2 of {TOTAL_STEPS} — Role</p>
              <h1 className="mb-2 text-3xl font-black">What&apos;s your role?</h1>
              <p className="mb-8 text-slate-400">Your role shapes how every signal is framed.</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setProfile((p) => ({ ...p, role: r.id }))}
                    className={`flex flex-col gap-1 rounded-xl border px-4 py-3.5 text-left transition-all ${profile.role === r.id ? "border-indigo-500 bg-indigo-600" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="text-sm font-bold">{r.label}</span>
                    </div>
                    <p className={`text-xs leading-tight ${profile.role === r.id ? "text-indigo-200" : "text-slate-500"}`}>{r.description}</p>
                  </button>
                ))}
              </div>
              <button disabled={!profile.role} onClick={() => setStep(3)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Step 3 — Content Goals ── */}
          {step === 3 && (
            <div>
              <button onClick={() => setStep(2)} className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="h-3 w-3" /> {roleObj?.emoji} {roleObj?.label}
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 3 of {TOTAL_STEPS} — Content Goals</p>
              <h1 className="mb-2 text-3xl font-black">What do you want from OMGSkill?</h1>
              <p className="mb-2 text-slate-400">Pick up to 3 goals — your briefing is built around these.</p>
              <p className="mb-8 text-xs text-slate-500">{profile.contentGoals.length}/3 selected</p>
              <div className="space-y-3">
                {CONTENT_GOALS.map((g) => {
                  const selected = profile.contentGoals.includes(g.id);
                  const maxed = !selected && profile.contentGoals.length >= 3;
                  return (
                    <button key={g.id} disabled={maxed} onClick={() => toggleGoal(g.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${selected ? "border-indigo-500 bg-indigo-600" : maxed ? "cursor-not-allowed border-slate-800 bg-slate-900 opacity-40" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{g.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-sm">{g.label}</p>
                            {selected && <CheckCircle2 className="h-4 w-4 text-indigo-200 flex-shrink-0" />}
                          </div>
                          <p className={`text-xs mt-0.5 ${selected ? "text-indigo-200" : "text-slate-400"}`}>{g.tagline}</p>
                          <p className={`text-xs mt-1 ${selected ? "text-indigo-300" : "text-slate-500"}`}>{g.delivers}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button disabled={profile.contentGoals.length === 0} onClick={() => setStep(4)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Step 4 — Voice ── */}
          {step === 4 && (
            <div>
              <button onClick={() => setStep(3)} className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Content goals
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 4 of {TOTAL_STEPS} — Voice</p>
              <h1 className="mb-2 text-3xl font-black">Your preferred voice</h1>
              <p className="mb-8 text-slate-400">Shapes how content, scripts, and hooks are written for you.</p>
              <div className="space-y-3">
                {VOICES.map((v) => (
                  <button key={v.id} onClick={() => setProfile((p) => ({ ...p, voicePreference: v.id }))}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${profile.voicePreference === v.id ? "border-indigo-500 bg-indigo-600" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
                    <p className="font-bold text-sm">{v.label}</p>
                    <p className={`text-xs mt-0.5 ${profile.voicePreference === v.id ? "text-indigo-200" : "text-slate-400"}`}>{v.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(5)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Step 5 — Premium Personalization ── */}
          {step === 5 && (
            <div>
              <button onClick={() => setStep(4)} className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Voice preference
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">Step 5 of {TOTAL_STEPS} — Premium</p>
              <h1 className="mb-2 text-3xl font-black">Hyper-personalization</h1>
              <p className="mb-6 text-slate-400">Optional — but this is what makes Premium extraordinary. Skip for standard briefings.</p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">LinkedIn Profile URL</label>
                  <input type="url" placeholder="https://linkedin.com/in/your-profile"
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, linkedinUrl: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <p className="mt-1 text-xs text-slate-500">Used to write content hooks in your authentic voice.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">Who inspires your thinking?</label>
                  <input type="text" placeholder="e.g. Andrej Karpathy, Ben Thompson, Seth Godin..."
                    value={profile.inspirations}
                    onChange={(e) => setProfile((p) => ({ ...p, inspirations: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <p className="mt-1 text-xs text-slate-500">Signals get framed through mental models you already use.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">What are you working on or advising right now?</label>
                  <textarea rows={3} placeholder="e.g. Selling AI automation tools to hospital CFOs. Building a compliance SaaS for insurance carriers..."
                    value={profile.currentProjects}
                    onChange={(e) => setProfile((p) => ({ ...p, currentProjects: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none" />
                  <p className="mt-1 text-xs text-slate-500">Every signal gets ranked by relevance to what you&apos;re actually doing.</p>
                </div>
              </div>
              <button onClick={finish} disabled={saving}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-60 hover:bg-indigo-500 transition-colors">
                {saving ? "Building your briefing..." : <><CheckCircle2 className="h-4 w-4" /> Go to my briefing</>}
              </button>
              <button onClick={() => { setProfile((p) => ({ ...p, linkedinUrl: "", inspirations: "", currentProjects: "" })); finish(); }}
                disabled={saving}
                className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40">
                Skip — use my industry &amp; role defaults
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
