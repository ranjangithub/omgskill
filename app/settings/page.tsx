import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/db";
import { getTierLabel } from "@/lib/auth";
import { CheckCircle, CreditCard, User } from "lucide-react";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const dbUser = getUser(userId);
  const profile = getProfile(userId);
  const tier = dbUser?.tier ?? "free";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-black text-slate-900">Settings</h1>

        {/* Account */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Account</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="text-sm font-semibold text-slate-800">
                {clerkUser?.firstName} {clerkUser?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-semibold text-slate-800">
                {clerkUser?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Subscription</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Current plan</p>
              <p className="text-lg font-black text-slate-900">{getTierLabel(tier)}</p>
              {tier === "free" && (
                <p className="mt-1 text-xs text-slate-400">Signals 1–3 only</p>
              )}
              {tier === "pro" && (
                <p className="mt-1 text-xs text-slate-400">All 10 signals + Drive Time</p>
              )}
              {tier === "premium" && (
                <p className="mt-1 text-xs text-slate-400">Everything + personalized briefings</p>
              )}
            </div>
            {tier === "free" ? (
              <Link
                href="/pricing"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                Upgrade
              </Link>
            ) : (
              <ManageBillingButton />
            )}
          </div>
        </section>

        {/* Profile */}
        {profile && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Briefing Profile</h2>
              </div>
              <Link href="/onboarding" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">
                Edit →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="text-sm font-semibold text-slate-800">{profile.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Industry</p>
                <p className="text-sm font-semibold text-slate-800">{profile.industry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Voice</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{profile.voicePreference}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Goals</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{profile.contentGoals.join(", ").replace(/-/g, " ")}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ManageBillingButton() {
  return (
    <form action="/api/billing/portal" method="POST">
      <button
        type="submit"
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Manage billing
      </button>
    </form>
  );
}
