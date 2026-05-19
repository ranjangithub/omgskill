import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getUser, getProfile, getBriefing, buildPersonaKey } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard-client";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function ArchiveDayPage({ params }: Props) {
  const { date } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  const tier = dbUser?.tier ?? "free";
  const profile = getProfile(userId);
  const personaKey = profile
    ? buildPersonaKey(profile.industry, profile.role, profile.contentGoals)
    : "default";

  const briefing = getBriefing(date, personaKey);
  if (!briefing) notFound();

  return (
    <DashboardClient briefing={briefing} tier={tier} today={date} profile={profile} />
  );
}
