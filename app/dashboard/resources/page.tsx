import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/db";
import { readResourcesFile, parseFrontmatter, extractAllSections } from "@/lib/md-reader";
import { INDUSTRIES } from "@/lib/personas/taxonomy";

export default async function ResourcesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = getProfile(userId);
  const industryId = profile?.industry ?? "technology-saas";
  const industryMeta = INDUSTRIES.find((i) => i.id === industryId);

  const raw = readResourcesFile(industryId);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-2xl">{industryMeta?.emoji}</span>
              <h1 className="text-2xl font-black text-slate-900">{industryMeta?.label} Resources</h1>
            </div>
            <p className="text-sm text-slate-500">Curated signal sources and communities for your industry.</p>
          </div>
          <Link href="/settings"
            className="flex-shrink-0 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            Change industry →
          </Link>
        </div>

        {/* Empty state */}
        {!raw && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="mb-2 text-base font-black text-slate-700">No resources generated yet</p>
            <p className="mb-4 text-sm text-slate-500 max-w-sm mx-auto">
              Run the skill from your terminal to generate curated resources for{" "}
              <strong>{industryMeta?.label}</strong>.
            </p>
            <div className="inline-block rounded-xl bg-slate-900 px-5 py-3 text-left font-mono text-sm text-emerald-400">
              /omgstack resources {industryId}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Or for all industries: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/omgstack resources all</code>
            </p>
          </div>
        )}

        {/* Render markdown content */}
        {raw && <ResourcesContent raw={raw} />}

      </div>
    </div>
  );
}

function ResourcesContent({ raw }: { raw: string }) {
  const { body } = parseFrontmatter(raw);
  const sections = extractAllSections(body);

  return (
    <div className="space-y-8">
      {Object.entries(sections).map(([header, content]) => (
        <section key={header}>
          <h2 className="mb-3 text-base font-black text-slate-900">{header}</h2>
          <MarkdownSection content={content} />
        </section>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-400">
          To refresh:{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] text-slate-700">
            /omgstack resources {"{industry}"}
          </code>
        </p>
      </div>
    </div>
  );
}

function MarkdownSection({ content }: { content: string }) {
  return (
    <div className="prose-sm prose-slate max-w-none">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-5 mb-1.5 text-sm font-black text-slate-800">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="mt-2 text-xs font-bold text-slate-700">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.startsWith("**") && line.includes(":**")) {
          const [label, ...rest] = line.split(":**");
          return (
            <p key={i} className="mt-1.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800">{label.replace(/\*\*/g, "")}:</span>{" "}
              {rest.join(":**").replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600 mt-1">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
              {line.slice(2)}
            </p>
          );
        }
        if (line.startsWith("---")) return <hr key={i} className="my-4 border-slate-100" />;
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="mt-2 text-sm leading-relaxed text-slate-600">
            {line}
          </p>
        );
      })}
    </div>
  );
}
