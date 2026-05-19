import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Clock, Flame, Globe, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Footer } from "@/components/footer";

const SIGNALS_PREVIEW = [
  { num: 1, type: "Strategic Signal", title: "Anthropic ships Claude 4 Opus with 200K context and 3× faster tool use", hook: "The enterprise context window just became irrelevant as a constraint." },
  { num: 2, type: "Governance Alert", title: "EU AI Act enforcement begins — first 6 companies fined €2.1M total", hook: "The regulation is no longer theoretical. Here's what triggered the fines." },
  { num: 3, type: "Emerging Trend", title: "GitHub Copilot Workspace hits 500K enterprise seats in 90 days", hook: "Agentic coding is now a standard enterprise procurement line item." },
];

const FEATURES = [
  { icon: BrainCircuit, title: "Expert Curation", desc: "20 years of enterprise AI architecture judgment encoded in the filter. Not a keyword algorithm — genuine expertise about what matters for SDLC, governance, and production systems." },
  { icon: Sparkles, title: "Personalized to You", desc: "Your role, industry, LinkedIn profile, and inspirations shape every signal. An Enterprise Architect in FinTech gets different framing than an AI Product Manager in Healthcare." },
  { icon: Zap, title: "LinkedIn Ready", desc: "Every signal includes a pre-written hook — the strongest opening line for a LinkedIn post. Start from strength, not a blank page." },
  { icon: Globe, title: "Drive Time Scripts", desc: "5-minute radio-style takes on the top signals, ready for your commute. Think out loud without the prep work." },
  { icon: Shield, title: "Governance Watch", desc: "Dedicated tracking of NIST AI RMF, EU AI Act enforcement, OWASP LLM Top 10, and responsible AI developments — filtered for enterprise practitioners." },
  { icon: TrendingUp, title: "Compounding Value", desc: "The longer you subscribe, the better the personalization gets. Your profile evolves as your interests and projects evolve." },
];

const SOCIAL_PROOF = [
  { name: "Marcus T.", role: "VP of AI, Fortune 500 Bank", quote: "I cancelled 4 newsletters after subscribing. This is the only one that thinks like an architect, not a journalist." },
  { name: "Priya S.", role: "AI Product Lead, HealthTech Startup", quote: "The LinkedIn hooks alone save me 2 hours a week. And the governance watch is exactly what my compliance team needed." },
  { name: "David K.", role: "Principal Engineer, Cloud Consulting", quote: "Drive Time is the killer feature. I'm 3x more current on AI than my clients, and it takes me 5 minutes a day." },
];

const CLASSIFICATION_TYPES = [
  { label: "Strategic Signal", color: "bg-indigo-100 text-indigo-700", desc: "Changes the landscape" },
  { label: "Emerging Trend", color: "bg-violet-100 text-violet-700", desc: "Worth watching closely" },
  { label: "Governance Alert", color: "bg-red-100 text-red-700", desc: "Compliance implications" },
  { label: "Tactical Update", color: "bg-amber-100 text-amber-700", desc: "Actionable this week" },
  { label: "Hype/Noise", color: "bg-slate-100 text-slate-500", desc: "Filtered out — not shown" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <MarketingNav />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300">
            <Flame className="h-4 w-4" />
            10 AI signals curated daily from 30+ sources
          </div>
          <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight lg:text-6xl">
            Your daily AI briefing,<br />
            <span className="text-indigo-400">filtered by expertise.</span><br />
            <span className="text-emerald-400">Personalized to you.</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-slate-300 leading-relaxed">
            omgskill.ai delivers 10 curated AI signals every morning — filtered through 20 years of enterprise AI architecture judgment. Not keyword matching. Expert curation, personalized to your role, industry, and how you think.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-7 py-3.5 text-base font-bold text-white hover:bg-indigo-500 transition-colors">
              Start free — no card required <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-7 py-3.5 text-base font-bold text-white hover:bg-white/15 transition-colors">
              See pricing →
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">Free forever for top 3 signals · Pro from $9/month · Cancel anytime</p>
        </div>
      </section>

      {/* ── Signal preview ── */}
      <section className="border-b border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Today&apos;s Briefing Preview</span>
            <h2 className="mt-2 text-3xl font-black text-slate-900">What landed in your inbox this morning</h2>
            <p className="mt-3 text-slate-500">Free users see 3 signals. Pro and Premium unlock all 10.</p>
          </div>

          <div className="space-y-4">
            {SIGNALS_PREVIEW.map((s) => (
              <div key={s.num} className="flex gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">{s.num}</div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-3 flex-wrap">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${s.type === "Strategic Signal" ? "bg-indigo-100 text-indigo-700" : s.type === "Governance Alert" ? "bg-red-100 text-red-700" : "bg-violet-100 text-violet-700"}`}>
                      {s.type}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm italic text-slate-500 border-l-2 border-indigo-300 pl-3">Hook: &ldquo;{s.hook}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

          {/* Paywall blur */}
          <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="blur-sm pointer-events-none select-none">
              <div className="flex gap-5">
                <div className="h-10 w-10 rounded-full bg-slate-300" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-300" />
                  <div className="h-5 w-3/4 rounded bg-slate-300" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
              <div className="text-center">
                <p className="mb-3 text-sm font-semibold text-slate-700">Signals 4–10 unlocked with Pro</p>
                <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                  Unlock all 10 signals — $9/mo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Classification system ── */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Signal Intelligence</span>
            <h2 className="mt-2 text-2xl font-black">Every signal is classified before it reaches you</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CLASSIFICATION_TYPES.map((t) => (
              <div key={t.label} className={`rounded-xl p-4 text-center ${t.label === "Hype/Noise" ? "opacity-50" : ""}`}>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold mb-2 ${t.color}`}>{t.label}</span>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">Hype/Noise is filtered out before it reaches your briefing. You only see what matters.</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Built Different</span>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Not a news aggregator. An intelligence system.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-100 bg-slate-50 p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-200 bg-indigo-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {[
              { num: "30+", label: "Sources scanned daily" },
              { num: "10", label: "Curated signals per day" },
              { num: "<5m", label: "Morning review time" },
              { num: "$0.03", label: "AI cost per full briefing" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-4xl font-black">{num}</p>
                <p className="mt-1 text-sm text-indigo-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black text-slate-900">From enterprise practitioners, not marketers</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SOCIAL_PROOF.map(({ name, role, quote }) => (
              <div key={name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-5 text-sm italic text-slate-600 leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-bold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-slate-950 to-indigo-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <Clock className="mx-auto mb-6 h-12 w-12 text-indigo-400" />
          <h2 className="mb-5 text-4xl font-black">5 minutes tomorrow morning.<br />Know what changed in AI overnight.</h2>
          <p className="mb-8 text-lg text-slate-300">Join enterprise architects, AI PMs, consultants, and tech leaders who replaced 4 newsletters with one expert briefing.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-500 transition-colors">
            Start free today <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-400">Free forever for top 3 signals · Pro $9/mo · Premium $29/mo</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
