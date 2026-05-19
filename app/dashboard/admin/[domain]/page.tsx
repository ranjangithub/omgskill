import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getUser } from "@/lib/db";
import {
  canAccessDomain,
  hasAnyAdminAccess,
  isSuperuser,
  EDITABLE_PATHS,
  readManagedFile,
  getPendingChanges,
} from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { INDUSTRIES } from "@/lib/personas/taxonomy";
import { DomainEditor } from "@/components/admin/DomainEditor";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function AdminDomainPage({ params }: Props) {
  const { domain } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  if (!hasAnyAdminAccess(userId)) redirect("/dashboard");
  if (!canAccessDomain(userId, domain)) redirect("/dashboard/admin");

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminSessionToken(token, userId)) {
    redirect(`/dashboard/admin/unlock?next=/dashboard/admin/${domain}`);
  }

  const industry = INDUSTRIES.find((i) => i.id === domain);
  if (!industry) notFound();

  const isSuper = isSuperuser(userId);
  const filePaths = EDITABLE_PATHS[domain] ?? [];

  // Load file contents server-side
  const files = filePaths.map((relativePath) => ({
    path: relativePath,
    label: relativePath.includes("source-registry") ? "Source Registry" : "Resources",
    content: readManagedFile(relativePath) ?? null,
  }));

  const pending = isSuper ? getPendingChanges(domain) : [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">

        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/admin" className="mb-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            ← All domains
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{industry.emoji}</span>
            <div>
              <h1 className="text-xl font-black text-slate-900">{industry.label}</h1>
              <p className="text-xs text-slate-500">
                {isSuper ? "Superuser — changes apply immediately" : "Domain expert — changes go to approval queue"}
              </p>
            </div>
          </div>
        </div>

        {/* Pending changes banner for this domain */}
        {isSuper && pending.length > 0 && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-base">⏳</span>
              <p className="text-sm font-bold text-amber-900">
                {pending.length} pending {pending.length === 1 ? "change" : "changes"} for this domain
              </p>
            </div>
            <Link href="/dashboard/admin/pending"
              className="flex-shrink-0 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors">
              Review →
            </Link>
          </div>
        )}

        {/* Domain editor client component */}
        <DomainEditor
          domain={domain}
          industryLabel={industry.label}
          files={files}
          isSuperuser={isSuper}
        />

      </div>
    </div>
  );
}
