import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getUser } from "@/lib/db";
import { hasAnyAdminAccess, getAccessibleDomains, getPendingChanges, isSuperuser, EDITABLE_PATHS } from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { INDUSTRIES } from "@/lib/personas/taxonomy";
import fs from "fs";
import path from "path";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  if (!hasAnyAdminAccess(userId)) redirect("/dashboard");

  // Verify HMAC-signed admin session (middleware only checks existence)
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminSessionToken(token, userId)) {
    redirect("/dashboard/admin/unlock");
  }

  const isSuper = isSuperuser(userId);
  const access = getAccessibleDomains(userId);
  const accessibleIndustries = access === "all"
    ? INDUSTRIES
    : INDUSTRIES.filter((i) => (access as string[]).includes(i.id));

  const pending = isSuper ? getPendingChanges() : [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🛠️</span>
              <h1 className="text-2xl font-black text-slate-900">Admin</h1>
              {isSuper && (
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                  Superuser
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Manage sources, influencers, and reference data across all industries.
            </p>
          </div>
        </div>

        {/* Pending approvals banner */}
        {isSuper && pending.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-base">⏳</span>
              <div>
                <p className="text-sm font-black text-amber-900">
                  {pending.length} pending {pending.length === 1 ? "change" : "changes"} await approval
                </p>
                <p className="text-xs text-amber-700">Submitted by domain experts</p>
              </div>
            </div>
            <Link href="/dashboard/admin/pending"
              className="flex-shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors">
              Review →
            </Link>
          </div>
        )}

        {/* Domain grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {access === "all" ? "All Industries" : "Your Domains"}
          </h2>
          <span className="text-xs text-slate-400">{accessibleIndustries.length} domains</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {accessibleIndustries.map((industry) => {
            const files = EDITABLE_PATHS[industry.id] ?? [];
            const existingFiles = files.filter((f) => {
              try { fs.accessSync(path.join(process.cwd(), f)); return true; } catch { return false; }
            });
            const domainPending = isSuper ? pending.filter((p) => p.domain === industry.id).length : 0;

            return (
              <Link
                key={industry.id}
                href={`/dashboard/admin/${industry.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <span className="text-2xl flex-shrink-0">{industry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-tight">{industry.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {existingFiles.length}/{files.length} files • {industry.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {domainPending > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                      {domainPending}
                    </span>
                  )}
                  <span className="text-slate-300 group-hover:text-indigo-500 transition-colors text-lg">›</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Role management (superuser only) */}
        {isSuper && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">👥</span>
              <h2 className="text-sm font-black text-slate-800">Domain Expert Access</h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Domain experts can submit changes to their assigned industries. You approve them here.
              To grant access, edit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 text-[11px]">data/admin/config.json</code> and add their Clerk user ID to the relevant domain.
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 font-mono text-[11px] text-slate-600">
              {`{\n  "domainExperts": {\n    "healthcare": ["user_xxx"],\n    "insurance": ["user_yyy"]\n  }\n}`}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
