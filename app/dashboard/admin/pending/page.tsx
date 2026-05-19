import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getUser } from "@/lib/db";
import { isSuperuser, getPendingChanges } from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { INDUSTRIES } from "@/lib/personas/taxonomy";
import { PendingReviewClient } from "@/components/admin/PendingReviewClient";

export default async function PendingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  if (!isSuperuser(userId)) redirect("/dashboard/admin");

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminSessionToken(token, userId)) {
    redirect("/dashboard/admin/unlock?next=/dashboard/admin/pending");
  }

  const pending = getPendingChanges();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">

        <div className="mb-6">
          <Link href="/dashboard/admin" className="mb-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            ← Admin home
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⏳</span>
            <div>
              <h1 className="text-xl font-black text-slate-900">Pending Approvals</h1>
              <p className="text-xs text-slate-500">Review changes submitted by domain experts</p>
            </div>
          </div>
        </div>

        {pending.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <span className="text-3xl block mb-3">✅</span>
            <p className="text-sm font-black text-slate-700">All clear</p>
            <p className="text-xs text-slate-400 mt-1">No pending changes to review</p>
          </div>
        )}

        {pending.length > 0 && (
          <PendingReviewClient
            initialChanges={pending}
            industries={INDUSTRIES.map((i) => ({ id: i.id, label: i.label, emoji: i.emoji }))}
          />
        )}
      </div>
    </div>
  );
}
