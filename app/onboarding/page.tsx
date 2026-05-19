"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

const ROLES = ["Enterprise Architect", "AI Product Manager", "Startup Founder", "VC / Investor", "AI Security Practitioner", "AI Researcher", "CTO / VP Engineering", "AI Consultant"];
const INDUSTRIES = ["FinTech", "Healthcare / MedTech", "Retail / eCommerce", "Government / Public Sector", "Cloud / SaaS", "Manufacturing", "Media / EdTech", "General Tech"];
const TOPICS = ["Generative AI", "Agentic AI & SDLC", "Responsible AI Governance", "AI Security", "RAG & Retrieval", "AI Coding Agents", "NIST AI RMF / EU AI Act", "LLMOps & Observability", "Open Source AI", "AI FinOps", "Blockchain & Decentralized Identity"];
const VOICES = [
  { id: "analytical", label: "Analytical & Direct", desc: "Data-first, no fluff. Like a senior architect's notes." },
  { id: "conversational", label: "Conversational", desc: "Approachable, easy to share with non-technical colleagues." },
  { id: "executive", label: "Executive Summary", desc: "Short, decisive. Built for C-suite and board communication." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    role: "", industry: "", topics: [] as string[],
    linkedinUrl: "", inspirations: "", currentProjects: "", voicePreference: "analytical",
  });

  const total = 4;

  function toggleTopic(t: string) {
    setProfile((p) => ({
      ...p,
      topics: p.topics.includes(t) ? p.topics.filter((x) => x !== t) : [...p.topics, t],
    }));
  }

  async function finish() {
    setSaving(true);
    await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600"><Zap className="h-4 w-4 text-white" /></div>
          <span className="font-black text-white">omgskill<span className="text-indigo-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i + 1 <= step ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Step 1 — Role */}
          {step === 1 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 1 of {total}</p>
              <h1 className="mb-2 text-3xl font-black">What&apos;s your role?</h1>
              <p className="mb-8 text-slate-400">This shapes how signals are framed for you.</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button key={r} onClick={() => setProfile((p) => ({ ...p, role: r }))}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold text-left transition-all ${profile.role === r ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <button disabled={!profile.role} onClick={() => setStep(2)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2 — Industry + Topics */}
          {step === 2 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 2 of {total}</p>
              <h1 className="mb-2 text-3xl font-black">Your industry &amp; topics</h1>
              <p className="mb-6 text-slate-400">Signals get filtered and framed for your context.</p>

              <p className="mb-3 text-sm font-bold text-slate-300">Industry</p>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => (
                  <button key={ind} onClick={() => setProfile((p) => ({ ...p, industry: ind }))}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold text-left transition-all ${profile.industry === ind ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"}`}>
                    {ind}
                  </button>
                ))}
              </div>

              <p className="mb-3 text-sm font-bold text-slate-300">Top topics (pick 3+)</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {TOPICS.map((t) => (
                  <button key={t} onClick={() => toggleTopic(t)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${profile.topics.includes(t) ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"}`}>
                    {profile.topics.includes(t) && "✓ "}{t}
                  </button>
                ))}
              </div>
              <p className="mb-6 text-xs text-slate-500">{profile.topics.length} selected</p>

              <button disabled={!profile.industry || profile.topics.length < 2} onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 3 — Voice */}
          {step === 3 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">Step 3 of {total}</p>
              <h1 className="mb-2 text-3xl font-black">Your preferred voice</h1>
              <p className="mb-8 text-slate-400">LinkedIn hooks and Drive Time scripts will match this style.</p>
              <div className="space-y-3">
                {VOICES.map((v) => (
                  <button key={v.id} onClick={() => setProfile((p) => ({ ...p, voicePreference: v.id as "analytical" | "conversational" | "executive" }))}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${profile.voicePreference === v.id ? "border-indigo-500 bg-indigo-600" : "border-slate-700 bg-slate-900 hover:border-slate-500"}`}>
                    <p className="font-bold text-sm">{v.label}</p>
                    <p className={`text-xs mt-0.5 ${profile.voicePreference === v.id ? "text-indigo-200" : "text-slate-400"}`}>{v.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(4)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold hover:bg-indigo-500 transition-colors">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 4 — Premium personalization (optional) */}
          {step === 4 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">Step 4 of {total} — Premium</p>
              <h1 className="mb-2 text-3xl font-black">Hyper-personalization</h1>
              <p className="mb-6 text-slate-400">Optional — but this is what makes Premium extraordinary. Skip to get Pro-level briefings.</p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">LinkedIn Profile URL</label>
                  <input type="url" placeholder="https://linkedin.com/in/your-profile"
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, linkedinUrl: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <p className="mt-1 text-xs text-slate-500">Used to understand your professional context and write hooks in your voice.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">Who inspires your thinking?</label>
                  <input type="text" placeholder="e.g. Andrej Karpathy, Ben Thompson, Andrew Ng..."
                    value={profile.inspirations}
                    onChange={(e) => setProfile((p) => ({ ...p, inspirations: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" />
                  <p className="mt-1 text-xs text-slate-500">Signals get framed through mental models you already use.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-300">What are you building or advising on right now?</label>
                  <textarea rows={3} placeholder="e.g. Building a RAG pipeline for compliance docs at a bank. Advising two AI startups on governance strategy..."
                    value={profile.currentProjects}
                    onChange={(e) => setProfile((p) => ({ ...p, currentProjects: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none" />
                  <p className="mt-1 text-xs text-slate-500">Signals get prioritized based on what&apos;s most relevant to your current work.</p>
                </div>
              </div>

              <button onClick={finish} disabled={saving}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-60 hover:bg-indigo-500 transition-colors">
                {saving ? "Setting up your briefing..." : <><CheckCircle2 className="h-4 w-4" /> Go to my briefing</>}
              </button>
              <button onClick={() => { setProfile((p) => ({ ...p, linkedinUrl: "", inspirations: "", currentProjects: "" })); finish(); }}
                className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Skip personalization — use persona defaults
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
