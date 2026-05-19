import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/db";
import { readResourcesFile, parseFrontmatter, extractAllSections } from "@/lib/md-reader";
import { INDUSTRIES } from "@/lib/personas/taxonomy";

export default async function ResourcesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = await getProfile(userId);
  const industryId = profile?.industry ?? "technology-saas";
  const industryMeta = INDUSTRIES.find((i) => i.id === industryId);

  const raw = readResourcesFile(industryId);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2.5">
              <span className="text-3xl">{industryMeta?.emoji ?? "📚"}</span>
              <h1 className="text-2xl font-black text-slate-900">AI Resources</h1>
            </div>
            <p className="text-sm text-slate-500">
              Curated signal sources, communities, and people worth following in{" "}
              <strong className="text-slate-700">{industryMeta?.label ?? "your industry"}</strong>.
            </p>
          </div>
          <Link
            href="/settings"
            className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
          >
            Change industry →
          </Link>
        </div>

        {/* Empty state */}
        {!raw && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
              📚
            </div>
            <p className="mb-2 text-base font-black text-slate-800">No resources generated yet</p>
            <p className="mb-6 text-sm text-slate-500 max-w-sm mx-auto">
              Run the skill from your terminal to generate curated AI resources for{" "}
              <strong className="text-slate-700">{industryMeta?.label}</strong>.
            </p>
            <div className="inline-block rounded-xl bg-slate-900 px-5 py-3 font-mono text-sm text-emerald-400 mb-3">
              /omgstack resources {industryId}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              All industries:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">/omgstack resources all</code>
            </p>
          </div>
        )}

        {/* Render sections */}
        {raw && <ResourcesContent raw={raw} industryId={industryId} />}

      </div>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

type Entry = {
  title: string;
  fields: Record<string, string>;
  bodyLines: string[];
};

// ── Parser ─────────────────────────────────────────────────────────────────────

function parseEntries(content: string): Entry[] {
  const blocks = content.split(/\n(?=### )/).filter((b) => b.trim());
  return blocks
    .map((block) => {
      const lines = block.trim().split("\n");
      const title = lines[0].replace(/^### /, "").trim();
      const fields: Record<string, string> = {};
      const bodyLines: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(/^\*\*([^*]+)\*\*:\s*(.+)/);
        if (match) {
          fields[match[1].toLowerCase()] = match[2].trim();
        } else if (line && !line.startsWith("---")) {
          bodyLines.push(line.replace(/^- /, "").trim());
        }
      }

      return { title, fields, bodyLines: bodyLines.filter(Boolean) };
    })
    .filter((e) => e.title);
}

function parseImpactBullets(content: string): string[] {
  return content
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
}

function parseImpactIntro(content: string): string {
  const lines = content.split("\n");
  const intro: string[] = [];
  for (const line of lines) {
    if (line.startsWith("### ") || line.startsWith("- ") || line.startsWith("---")) break;
    if (line.trim()) intro.push(line.trim());
  }
  return intro.join(" ");
}

// ── Main content renderer ──────────────────────────────────────────────────────

function ResourcesContent({ raw, industryId }: { raw: string; industryId: string }) {
  const { body } = parseFrontmatter(raw);
  const sections = extractAllSections(body);

  return (
    <div className="space-y-10">
      {/* AI Impact Section */}
      {sections["AI & Your Industry"] && (
        <AIImpactSection content={sections["AI & Your Industry"]} />
      )}

      {/* LinkedIn Follows */}
      {sections["Who to Follow on LinkedIn"] && (
        <PeopleSection
          title="Who to Follow on LinkedIn"
          icon="💼"
          accentColor="indigo"
          ctaLabel="Follow on LinkedIn"
          ctaField="linkedin"
          content={sections["Who to Follow on LinkedIn"]}
          personSeparator=" | "
        />
      )}

      {/* Twitter/X Follows */}
      {sections["Who to Follow on X (Twitter)"] && (
        <PeopleSection
          title="Who to Follow on X"
          icon="𝕏"
          accentColor="slate"
          ctaLabel="Follow on X"
          ctaField="twitter"
          content={sections["Who to Follow on X (Twitter)"]}
          personSeparator=" — "
        />
      )}

      {/* Blogs */}
      {sections["Blogs & Publications"] && (
        <BlogsSection content={sections["Blogs & Publications"]} />
      )}

      {/* Groups */}
      {sections["LinkedIn Groups to Join"] && (
        <GroupsSection content={sections["LinkedIn Groups to Join"]} />
      )}

      {/* Refresh footer */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
        <p className="text-xs text-slate-400 mb-1">Refresh resources anytime with the omgstack CLI:</p>
        <code className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
          /omgstack resources {industryId}
        </code>
      </div>
    </div>
  );
}

// ── AI Impact Section ─────────────────────────────────────────────────────────

function AIImpactSection({ content }: { content: string }) {
  const intro = parseImpactIntro(content);
  const bullets = parseImpactBullets(content);

  return (
    <section>
      <SectionHeader icon="⚡" title="AI & Your Industry" />
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm">
        {intro && (
          <p className="text-sm leading-relaxed text-slate-700 mb-5">{intro}</p>
        )}
        {bullets.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
              What&apos;s actually changing
            </p>
            {bullets.map((bullet, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-black text-indigo-600">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-700">{bullet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── People Section (LinkedIn + Twitter) ───────────────────────────────────────

function PeopleSection({
  title,
  icon,
  accentColor,
  ctaLabel,
  ctaField,
  content,
  personSeparator,
}: {
  title: string;
  icon: string;
  accentColor: "indigo" | "slate";
  ctaLabel: string;
  ctaField: string;
  content: string;
  personSeparator: string;
}) {
  const entries = parseEntries(content);
  if (!entries.length) return null;

  const isIndigo = accentColor === "indigo";

  return (
    <section>
      <SectionHeader icon={icon} title={title} count={entries.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry, i) => {
          const parts = entry.title.split(personSeparator);
          const name = parts[0].trim();
          const role = parts[1]?.trim() ?? "";
          const whyFollow = entry.fields["why follow"] ?? entry.bodyLines[0] ?? "";
          const ctaUrl = entry.fields[ctaField] ?? entry.fields["linkedin"] ?? entry.fields["twitter"] ?? "";

          const initials = name
            .replace(/^@/, "")
            .split(/[\s—]+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar + name */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    isIndigo
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-tight">{name}</p>
                  {role && (
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{role}</p>
                  )}
                </div>
              </div>

              {/* Why follow */}
              <p className="flex-1 text-xs leading-relaxed text-slate-600 mb-4 line-clamp-4">
                {whyFollow}
              </p>

              {/* CTA */}
              {ctaUrl ? (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                    isIndigo
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {ctaLabel} →
                </a>
              ) : (
                <span className="text-xs text-slate-300 italic">No link available</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Blogs Section ─────────────────────────────────────────────────────────────

function BlogsSection({ content }: { content: string }) {
  const entries = parseEntries(content);
  if (!entries.length) return null;

  return (
    <section>
      <SectionHeader icon="📰" title="Blogs & Publications" count={entries.length} />
      <div className="space-y-3">
        {entries.map((entry, i) => {
          const whyRead = entry.fields["why read"] ?? entry.bodyLines[0] ?? "";
          const url = entry.fields["url"] ?? "";
          const cadence = entry.fields["cadence"] ?? "";

          return (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Index badge */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-sm font-black text-amber-600">
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-black text-slate-900">{entry.title}</p>
                  {cadence && (
                    <span className="flex-shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                      {cadence}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 mb-2">{whyRead}</p>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Read Now →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── LinkedIn Groups Section ────────────────────────────────────────────────────

function GroupsSection({ content }: { content: string }) {
  const entries = parseEntries(content);
  if (!entries.length) return null;

  return (
    <section>
      <SectionHeader icon="👥" title="LinkedIn Groups to Join" count={entries.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry, i) => {
          const whyJoin = entry.fields["why join"] ?? entry.bodyLines[0] ?? "";
          const url = entry.fields["url"] ?? "";
          const members = entry.fields["members"] ?? "";

          return (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Name + member count */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-black text-slate-900 leading-tight">{entry.title}</p>
                {members && (
                  <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 whitespace-nowrap">
                    {members} members
                  </span>
                )}
              </div>

              {/* Why join */}
              <p className="flex-1 text-xs leading-relaxed text-slate-500 mb-4 line-clamp-3">{whyJoin}</p>

              {/* CTA */}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all active:scale-95"
                >
                  Join Group →
                </a>
              ) : (
                <span className="text-xs text-slate-300 italic">No link available</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count }: { icon: string; title: string; count?: number }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="text-xl">{icon}</span>
      <h2 className="text-base font-black text-slate-900">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
          {count}
        </span>
      )}
    </div>
  );
}
