"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { INDUSTRIES, ROLES, CONTENT_GOALS } from "@/lib/personas/taxonomy";

const TOTAL_STEPS = 3;

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [contentGoals, setContentGoals] = useState<string[]>([]);

  function toggleGoal(id: string) {
    setContentGoals((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function proceed() {
    localStorage.setItem(
      "omgskill_preauth",
      JSON.stringify({
        industry,
        role,
        contentGoals: contentGoals.length ? contentGoals : ["stay-updated"],
      })
    );
    router.push("/sign-up");
  }

  const industryObj = INDUSTRIES.find((i) => i.id === industry);
  const roleObj = ROLES.find((r) => r.id === role);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-white">
            omgskill<span className="text-indigo-400">.ai</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i + 1 <= step ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-start px-6 py-10">
        <div className="w-full max-w-xl">

          {/* ── Step 1 — Industry ── */}
          {step === 1 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                Step 1 of {TOTAL_STEPS} — Industry
              </p>
              <h1 className="mb-2 text-3xl font-black">What industry are you in?</h1>
              <p className="mb-8 text-slate-400">
                Signals get filtered and framed for your sector.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      industry === ind.id
                        ? "border-indigo-500 bg-indigo-600"
                        : "border-slate-700 bg-slate-900 hover:border-slate-500"
                    }`}
                  >
                    <span className="text-xl">{ind.emoji}</span>
                    <span className="text-sm font-semibold leading-tight">{ind.label}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!industry}
                onClick={() => setStep(2)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-center text-xs text-slate-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ── Step 2 — Role ── */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> {industryObj?.emoji} {industryObj?.label}
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                Step 2 of {TOTAL_STEPS} — Role
              </p>
              <h1 className="mb-2 text-3xl font-black">What&apos;s your role?</h1>
              <p className="mb-8 text-slate-400">
                Every signal gets reframed for how you actually work.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col gap-1 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      role === r.id
                        ? "border-indigo-500 bg-indigo-600"
                        : "border-slate-700 bg-slate-900 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="text-sm font-bold">{r.label}</span>
                    </div>
                    <p className={`text-xs leading-tight ${role === r.id ? "text-indigo-200" : "text-slate-500"}`}>
                      {r.description}
                    </p>
                  </button>
                ))}
              </div>
              <button
                disabled={!role}
                onClick={() => setStep(3)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold disabled:opacity-40 hover:bg-indigo-500 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Step 3 — Goals + CTA ── */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> {roleObj?.emoji} {roleObj?.label}
              </button>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                Step 3 of {TOTAL_STEPS} — Goals
              </p>
              <h1 className="mb-2 text-3xl font-black">What do you want from this?</h1>
              <p className="mb-2 text-slate-400">
                Pick up to 3 — your briefing is built around these every morning.
              </p>
              <p className="mb-8 text-xs text-slate-500">{contentGoals.length}/3 selected</p>

              <div className="space-y-3">
                {CONTENT_GOALS.map((g) => {
                  const selected = contentGoals.includes(g.id);
                  const maxed = !selected && contentGoals.length >= 3;
                  return (
                    <button
                      key={g.id}
                      disabled={maxed}
                      onClick={() => toggleGoal(g.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-indigo-500 bg-indigo-600"
                          : maxed
                          ? "cursor-not-allowed border-slate-800 bg-slate-900 opacity-40"
                          : "border-slate-700 bg-slate-900 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{g.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-sm">{g.label}</p>
                            {selected && <CheckCircle2 className="h-4 w-4 text-indigo-200 flex-shrink-0" />}
                          </div>
                          <p className={`text-xs mt-0.5 ${selected ? "text-indigo-200" : "text-slate-400"}`}>
                            {g.tagline}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Summary + CTA */}
              <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-indigo-950/60 p-5">
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                    {industryObj?.emoji} {industryObj?.label}
                  </span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                    {roleObj?.emoji} {roleObj?.label}
                  </span>
                  {contentGoals.length > 0 && (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                      {contentGoals.length} {contentGoals.length === 1 ? "goal" : "goals"} selected
                    </span>
                  )}
                </div>
                <p className="mb-4 text-xs text-slate-400">
                  Your first briefing will be personalized for this profile. You can refine it anytime.
                </p>
                <button
                  onClick={proceed}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95"
                >
                  Create my free account <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Free forever for top 3 signals · No card required
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
