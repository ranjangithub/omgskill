import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser, getProfile, buildPersonaKey, getBriefing } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard-client";
import { getMockBriefing } from "@/lib/mock-briefings";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const profile = getProfile(userId);
  const today = new Date().toISOString().split("T")[0];
  const personaKey = profile
    ? buildPersonaKey(profile.industry, profile.role, profile.contentGoals)
    : "default";

  const briefing = getBriefing(today, personaKey) ?? getMockBriefing(profile?.industry ?? "technology-saas");
  const tier = dbUser?.tier ?? "free";

  return (
    <DashboardClient
      briefing={briefing}
      tier={tier}
      today={today}
      profile={profile}
    />
  );
}
