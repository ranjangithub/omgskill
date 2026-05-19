import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/db";
import { readOpportunitiesFixed, readOpportunitiesDaily, parseFrontmatter } from "@/lib/md-reader";
import { INDUSTRIES } from "@/lib/personas/taxonomy";

export default async function OpportunitiesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = await getProfile(userId);
  const industryId = profile?.industry ?? "technology-saas";
  const industryMeta = INDUSTRIES.find((i) => i.id === industryId);

  const today = new Date().toISOString().split("T")[0];
  const fixedRaw = readOpportunitiesFixed();
  const dailyRaw = readOpportunitiesDaily(today, industryId);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">{industryMeta?.emoji}</span>
            <h1 className="text-2xl font-black text-slate-900">Opportunity Scanner</h1>
          </div>
          <p className="text-sm text-slate-500">
            Hackathons, conferences, webinars, and competitions for{" "}
            <strong className="text-slate-700">{industryMeta?.label}</strong> AI professionals.
          </p>
        </div>

        {/* Today's discoveries */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">📡</span>
              <h2 className="text-sm font-black uppercase tracking-widest text-indigo-700">
                Today&apos;s Discoveries
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">{today}</span>
          </div>

          {!dailyRaw ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center">
              <p className="mb-2 text-sm font-bold text-slate-700">No daily scan yet for today</p>
              <p className="mb-4 text-xs text-slate-500">
                Run the skill to scan for new opportunities announced today.
              </p>
              <div className="inline-block rounded-xl bg-slate-900 px-4 py-2.5 font-mono text-sm text-emerald-400">
                /omgstack opportunities {industryId}
              </div>
            </div>
          ) : (
            <OpportunitiesMarkdown raw={dailyRaw} variant="daily" />
          )}
        </section>

        {/* Evergreen fixed list */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">📌</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
              Always Open
            </h2>
            <span className="ml-auto text-[10px] text-slate-400">Evergreen — run /omgstack opportunities fixed to update</span>
          </div>

          {!fixedRaw ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="mb-2 text-sm font-bold text-slate-700">Evergreen list not generated yet</p>
              <div className="inline-block rounded-xl bg-slate-900 px-4 py-2.5 font-mono text-sm text-emerald-400">
                /omgstack opportunities fixed
              </div>
            </div>
          ) : (
            <OpportunitiesMarkdown raw={fixedRaw} variant="fixed" />
          )}
        </section>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Curated for <strong className="text-slate-600">{industryMeta?.label}</strong>.{" "}
            <Link href="/settings" className="font-bold text-indigo-600 hover:underline">Change industry →</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

// ── Opportunity card parser ────────────────────────────────────────────────────
// Parses markdown entries starting with "### Title" and collects key: value lines

function OpportunitiesMarkdown({ raw, variant }: { raw: string; variant: "fixed" | "daily" }) {
  const { body } = parseFrontmatter(raw);

  // Split by "### " to get individual opportunity blocks
  const blocks = body.split(/\n(?=### )/).filter((b) => b.startsWith("### ") || b.includes("### "));

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        No opportunities found in this file. Re-run the skill to regenerate.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const title = lines[0]?.replace(/^### /, "").trim() ?? "";
        if (!title) return null;

        const fields: Record<string, string> = {};
        for (const line of lines.slice(1)) {
          const m = line.match(/^\*\*([^*]+)\*\*:\s*(.+)/);
          if (m) fields[m[1].trim()] = m[2].trim();
        }

        const type = (fields["Type"] ?? "conference").toLowerCase();
        const typeEmoji: Record<string, string> = {
          hackathon: "💻", conference: "🎤", webinar: "📡",
          competition: "🏆", community: "🤝",
        };

        return (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                  {typeEmoji[type] ?? "📅"} {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                {fields["Cost"] && (
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    fields["Cost"].toLowerCase() === "free"
                      ? "bg-emerald-50 text-emerald-700"
                      : fields["Cost"].toLowerCase() === "paid"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {fields["Cost"]}
                  </span>
                )}
                {fields["Format"] && (
                  <span className="text-[10px] text-slate-400">
                    {fields["Format"].toLowerCase() === "virtual" ? "🌐" : fields["Format"].toLowerCase() === "in-person" ? "📍" : "🔀"} {fields["Format"]}
                  </span>
                )}
              </div>
              {fields["URL"] && (
                <a href={fields["URL"]} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  Open ↗
                </a>
              )}
            </div>

            <p className="mb-0.5 text-sm font-black text-slate-900 leading-snug">{title}</p>
            {fields["Organizer"] && <p className="mb-2 text-xs text-slate-400">{fields["Organizer"]}</p>}
            {fields["Description"] && <p className="text-xs leading-relaxed text-slate-600">{fields["Description"]}</p>}

            {(fields["When"] || fields["Deadline"]) && (
              <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-100 pt-3">
                {fields["When"] && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">When</p>
                    <p className="text-xs font-semibold text-slate-700">{fields["When"]}</p>
                  </div>
                )}
                {fields["Deadline"] && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Deadline</p>
                    <p className="text-xs font-semibold text-amber-700">{fields["Deadline"]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
