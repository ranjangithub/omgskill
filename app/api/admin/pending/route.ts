import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isSuperuser, getPendingChanges, checkRateLimit } from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

// GET /api/admin/pending?domain=healthcare
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminSessionToken(token, userId)) {
    return NextResponse.json({ error: "Admin session expired" }, { status: 401 });
  }
  if (!isSuperuser(userId)) {
    return NextResponse.json({ error: "Superuser only" }, { status: 403 });
  }

  if (!checkRateLimit(`pending_read:${userId}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const domain = req.nextUrl.searchParams.get("domain") ?? undefined;
  const changes = getPendingChanges(domain);
  return NextResponse.json({ changes });
}
