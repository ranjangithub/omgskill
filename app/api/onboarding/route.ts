import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { upsertProfile, markOnboarded } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await upsertProfile({
    userId,
    industry:       body.industry       ?? "technology-saas",
    role:           body.role           ?? "technology",
    contentGoals:   body.contentGoals   ?? ["stay-updated"],
    linkedinUrl:    body.linkedinUrl    || null,
    inspirations:   body.inspirations   || null,
    currentProjects: body.currentProjects || null,
    voicePreference: body.voicePreference ?? "analytical",
  });
  await markOnboarded(userId);
  return NextResponse.json({ ok: true });
}
