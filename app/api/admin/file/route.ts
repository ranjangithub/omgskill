import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  canAccessDomain,
  isPathAllowed,
  readManagedFile,
  writeManagedFile,
  isSuperuser,
  savePendingChange,
  domainFromPath,
  validateContent,
  verifyCsrf,
  checkRateLimit,
  logAudit,
} from "@/lib/admin";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function verifyAdminSession(userId: string): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token, userId);
}

// GET /api/admin/file?path=sources/healthcare/source-registry.md
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdminSession(userId))) {
    return NextResponse.json({ error: "Admin session expired" }, { status: 401 });
  }

  const filePath = req.nextUrl.searchParams.get("path") ?? "";
  if (!isPathAllowed(filePath)) {
    logAudit({ userId, action: "file_read_denied", file: filePath, detail: "path not allowed" });
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  const domain = domainFromPath(filePath);
  if (!domain || !canAccessDomain(userId, domain)) {
    logAudit({ userId, action: "file_read_denied", file: filePath, detail: "domain access denied" });
    return NextResponse.json({ error: "No access to this domain" }, { status: 403 });
  }

  const content = readManagedFile(filePath);
  return NextResponse.json({ content: content ?? "", exists: content !== null });
}

// PUT /api/admin/file  { path, content, pendingMeta? }
export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdminSession(userId))) {
    return NextResponse.json({ error: "Admin session expired" }, { status: 401 });
  }

  // CSRF: origin must match app URL
  if (!verifyCsrf(req.headers.get("origin"))) {
    logAudit({ userId, action: "file_write_csrf_rejected" });
    return NextResponse.json({ error: "CSRF check failed" }, { status: 403 });
  }

  // Rate limit: 15 writes per minute per user
  if (!checkRateLimit(`write:${userId}`, 15, 60 * 1000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { path: filePath, content, pendingMeta } = body as {
    path: unknown;
    content: unknown;
    pendingMeta?: { operation: "add" | "edit" | "delete"; section: string; entry: string };
  };

  if (typeof filePath !== "string") {
    return NextResponse.json({ error: "path must be a string" }, { status: 400 });
  }
  if (!isPathAllowed(filePath)) {
    logAudit({ userId, action: "file_write_denied", file: filePath, detail: "path not allowed" });
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  // Derive domain from path — never trust client-supplied domain
  const domain = domainFromPath(filePath);
  if (!domain || !canAccessDomain(userId, domain)) {
    logAudit({ userId, action: "file_write_denied", file: filePath, detail: "domain access denied" });
    return NextResponse.json({ error: "No access to this domain" }, { status: 403 });
  }

  const validation = validateContent(content);
  if (!validation.ok) {
    logAudit({ userId, action: "file_write_denied", file: filePath, detail: validation.reason });
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  if (isSuperuser(userId)) {
    writeManagedFile(filePath, validation.value);
    logAudit({
      userId,
      action: "file_written",
      file: filePath,
      domain,
      detail: pendingMeta ? `${pendingMeta.operation} "${pendingMeta.entry}" in ${pendingMeta.section}` : "raw edit",
    });
    return NextResponse.json({ ok: true, applied: true });
  }

  // Domain expert path: create pending change
  if (!pendingMeta || !pendingMeta.operation || !pendingMeta.section) {
    return NextResponse.json({ error: "pendingMeta required for non-superuser" }, { status: 400 });
  }
  const change = savePendingChange({
    domain,
    file: filePath,
    operation: pendingMeta.operation,
    section: pendingMeta.section,
    entry: pendingMeta.entry ?? "",
    content: validation.value,
    submittedBy: userId,
    submittedAt: new Date().toISOString(),
  });
  logAudit({
    userId,
    action: "pending_submitted",
    file: filePath,
    domain,
    detail: `${pendingMeta.operation} "${pendingMeta.entry}" — pending id ${change.id}`,
  });
  return NextResponse.json({ ok: true, applied: false, pendingId: change.id });
}
