import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  isSuperuser,
  getPendingChange,
  deletePendingChange,
  writeManagedFile,
  isPathAllowed,
  isValidPendingId,
  verifyCsrf,
  checkRateLimit,
  logAudit,
} from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

interface Props {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/pending/[id]  { action: 'approve' | 'reject' }
export async function PUT(req: NextRequest, { params }: Props) {
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

  if (!verifyCsrf(req.headers.get("origin"))) {
    logAudit({ userId, action: "pending_action_csrf_rejected" });
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  if (!checkRateLimit(`pending_action:${userId}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { id } = await params;
  if (!isValidPendingId(id)) {
    return NextResponse.json({ error: "Invalid change ID" }, { status: 400 });
  }

  const { action } = await req.json() as { action: "approve" | "reject" };
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }

  const change = getPendingChange(id);
  if (!change) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    if (!isPathAllowed(change.file)) {
      logAudit({ userId, action: "pending_approve_denied", detail: `path not allowed: ${change.file}` });
      return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
    }
    writeManagedFile(change.file, change.content);
    logAudit({
      userId,
      action: "pending_approved",
      file: change.file,
      domain: change.domain,
      detail: `id=${id}, ${change.operation} "${change.entry}" by ${change.submittedBy}`,
    });
  } else {
    logAudit({
      userId,
      action: "pending_rejected",
      detail: `id=${id}, ${change.operation} "${change.entry}" by ${change.submittedBy}`,
    });
  }

  deletePendingChange(id);
  return NextResponse.json({ ok: true, action });
}

// DELETE /api/admin/pending/[id]  (reject shorthand)
export async function DELETE(req: NextRequest, { params }: Props) {
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

  if (!verifyCsrf(req.headers.get("origin"))) {
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  const { id } = await params;
  if (!isValidPendingId(id)) {
    return NextResponse.json({ error: "Invalid change ID" }, { status: 400 });
  }

  const change = getPendingChange(id);
  if (change) {
    logAudit({
      userId,
      action: "pending_rejected",
      detail: `id=${id}, by ${change.submittedBy}`,
    });
  }

  deletePendingChange(id);
  return NextResponse.json({ ok: true });
}
