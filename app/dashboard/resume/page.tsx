import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/db";
import { readResumeAnalysis, parseFrontmatter, extractAllSections } from "@/lib/md-reader";
import { INDUSTRIES, ROLES } from "@/lib/personas/taxonomy";

export default async function ResumePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = await getProfile(userId);
  const tier = dbUser.tier ?? "free";

  const industryLabel = INDUSTRIES.find((i) => i.id === profile?.industry)?.label ?? "Your Industry";
  const roleLabel = ROLES.find((r) => r.id === profile?.role)?.label ?? "Your Role";

  const raw = tier !== "free" ? readResumeAnalysis(userId) : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h1 className="text-2xl font-black text-slate-900">Resume & Skill Gap Analyzer</h1>
          </div>
          <p className="text-sm text-slate-500">
            AI readiness score, skill gaps, and a curated learning plan for{" "}
            <strong className="text-slate-700">{roleLabel}</strong> in{" "}
            <strong className="text-slate-700">{industryLabel}</strong>.
          </p>
        </div>

        {/* Free tier paywall */}
        {tier === "free" && (
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">🔒</div>
            <p className="mb-2 text-lg font-black text-slate-900">Pro Feature</p>
            <p className="mb-6 text-sm text-slate-500 max-w-sm mx-auto">
              Resume analysis generates a deep, personalized AI skill gap report and curated learning plan.
            </p>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
              Upgrade to Pro — $9/mo →
            </Link>
          </div>
        )}

        {/* Pro: no analysis yet */}
        {tier !== "free" && !raw && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="mb-2 text-base font-black text-slate-700">No analysis yet</p>
              <p className="mb-5 text-sm text-slate-500 max-w-sm mx-auto">
                Run the skill from your terminal. Paste your resume when prompted,
                and the analysis will appear here automatically.
              </p>
              <div className="inline-block rounded-xl bg-slate-900 px-5 py-3 font-mono text-sm text-emerald-400 mb-3">
                /omgstack resume
              </div>
              <p className="text-xs text-slate-400">
                Or with a file:{" "}
                <code className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-600">
                  /omgstack resume path/to/resume.txt
                </code>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-sm font-black text-slate-800">What you&apos;ll get</p>
              <ul className="space-y-2">
                {[
                  "AI Readiness Score (1–10) with interpretation",
                  "Current strengths pulled from your resume",
                  "4–7 skill gaps ranked by importance (critical / high / medium)",
                  "Learning plan with real resources, timelines, and URLs",
                  "90-day action plan with weekly milestones",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Pro: analysis exists */}
        {tier !== "free" && raw && <ResumeAnalysisView raw={raw} userId={userId} />}

      </div>
    </div>
  );
}

// ── Analysis renderer ─────────────────────────────────────────────────────────

function ResumeAnalysisView({ raw, userId }: { raw: string; userId: string }) {
  const { meta, body } = parseFrontmatter(raw);
  const sections = extractAllSections(body);

  const score = parseInt(meta.aiReadinessScore ?? "0", 10);
  const scoreColor = score >= 7 ? "text-emerald-600" : score >= 5 ? "text-amber-600" : "text-red-600";
  const scoreBg = score >= 7 ? "bg-emerald-50 border-emerald-200" : score >= 5 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  const analyzedDate = meta.analyzedAt
    ? new Date(meta.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Unknown";

  return (
    <div>
      {/* Score banner */}
      <div className={`mb-6 rounded-2xl border p-5 ${scoreBg}`}>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-4xl font-black ${scoreColor}`}>{score}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${scoreColor}`}>/ 10</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">AI Readiness Score</p>
            {sections["Your Top Priority"] && (
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {sections["Your Top Priority"].split("\n")[0]}
              </p>
            )}
            <p className="mt-1.5 text-[11px] text-slate-400">Analyzed {analyzedDate}</p>
          </div>
        </div>
      </div>

      {/* All sections */}
      <div className="space-y-6">
        {Object.entries(sections)
          .filter(([header]) => header !== "Your Top Priority")
          .map(([header, content]) => (
            <section key={header} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <h2 className="text-sm font-black text-slate-800">{header}</h2>
              </div>
              <div className="px-5 py-4">
                <ResumeSection content={content} />
              </div>
            </section>
          ))}
      </div>

      {/* Re-analyze nudge */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-500 mb-1">To re-analyze with an updated resume:</p>
        <code className="text-xs text-slate-700 bg-slate-200 px-2 py-1 rounded">
          /omgstack resume
        </code>
      </div>
    </div>
  );
}

function ResumeSection({ content }: { content: string }) {
  return (
    <div className="space-y-1.5">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("### ")) {
          const text = line.slice(4);
          const isRed = text.startsWith("🔴");
          const isOrange = text.startsWith("🟠");
          const isYellow = text.startsWith("🟡");
          return (
            <p key={i} className={`mt-4 mb-1 text-sm font-black ${isRed ? "text-red-700" : isOrange ? "text-amber-700" : isYellow ? "text-yellow-700" : "text-slate-800"}`}>
              {text}
            </p>
          );
        }
        if (line.startsWith("**") && line.includes(":**")) {
          const [label, ...rest] = line.split(":**");
          return (
            <p key={i} className="text-xs text-slate-600">
              <span className="font-bold text-slate-800">{label.replace(/\*\*/g, "")}:</span>{" "}
              {rest.join(":**").replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
              <p className="text-sm leading-relaxed text-slate-600">{line.slice(2)}</p>
            </div>
          );
        }
        if (line.startsWith("**")) {
          return (
            <p key={i} className="mt-3 text-sm font-bold text-slate-800">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.trim() === "" || line.startsWith("---")) return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm leading-relaxed text-slate-600">{line}</p>;
      })}
    </div>
  );
}
