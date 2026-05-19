import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile, listBriefingDates, buildPersonaKey } from "@/lib/db";
import { Calendar } from "lucide-react";

export default async function ArchivePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = getProfile(userId);
  const personaKey = profile
    ? buildPersonaKey(profile.role, profile.industry, profile.topics)
    : "default";

  const dates = listBriefingDates(personaKey);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-slate-400" />
          <h1 className="text-2xl font-black text-slate-900">Archive</h1>
        </div>

        {dates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-bold text-slate-500">No past briefings yet</p>
            <p className="mt-1 text-xs text-slate-400">Check back tomorrow for your first archived briefing</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dates.map((date) => (
              <Link
                key={date}
                href={`/dashboard/${date}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                <p className="text-sm font-bold text-slate-800">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
                <span className="text-xs font-bold text-indigo-600">Read →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
