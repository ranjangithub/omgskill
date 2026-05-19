import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPin,
  createAdminSessionToken,
  adminCookieOptions,
  ADMIN_COOKIE_NAME,
  getAdminPin,
} from "@/lib/admin-auth";
import { hasAnyAdminAccess, checkRateLimit, logAudit } from "@/lib/admin";

// POST /api/admin/unlock  { pin: string }
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Must have at least domain-expert or superuser role
  if (!hasAnyAdminAccess(userId)) {
    logAudit({ userId, action: "unlock_denied", detail: "no admin role" });
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Rate limit: 5 attempts per 15 minutes per user
  if (!checkRateLimit(`pin:${userId}`, 5, 15 * 60 * 1000)) {
    logAudit({ userId, action: "unlock_rate_limited" });
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  // If no ADMIN_PIN is configured, deny in production; allow in dev with a warning
  if (!getAdminPin()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Admin PIN not configured" }, { status: 503 });
    }
    // Dev shortcut: no PIN required if ADMIN_PIN is not set
  } else {
    const body = await req.json().catch(() => ({}));
    const { pin } = body as { pin?: string };
    if (!verifyAdminPin(pin ?? "")) {
      logAudit({ userId, action: "unlock_wrong_pin" });
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
    }
  }

  const token = createAdminSessionToken(userId);
  const isProduction = process.env.NODE_ENV === "production";
  const opts = adminCookieOptions(isProduction);

  logAudit({ userId, action: "unlock_success" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, opts);
  return res;
}
