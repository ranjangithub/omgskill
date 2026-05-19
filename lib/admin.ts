import fs from "fs";
import path from "path";

const CWD = process.cwd();
const CONFIG_PATH = path.join(CWD, "data/admin/config.json");
const PENDING_DIR = path.join(CWD, "data/admin/pending");
const AUDIT_LOG = path.join(CWD, "data/admin/audit.log.jsonl");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminConfig {
  superusers: string[];
  domainExperts: Record<string, string[]>;
}

export type ChangeOperation = "add" | "edit" | "delete";

export interface PendingChange {
  id: string;
  domain: string;
  file: string;
  operation: ChangeOperation;
  section: string;
  entry: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
}

export interface AuditEntry {
  ts: string;
  userId: string;
  action: string;
  file?: string;
  domain?: string;
  detail?: string;
  ip?: string;
}

// ── Allowlist (the only files the admin can touch) ────────────────────────────

export const EDITABLE_PATHS: Record<string, string[]> = {
  "healthcare":       ["sources/healthcare/source-registry.md",       "data/resources/healthcare.md"],
  "banking-finance":  ["sources/banking-finance/source-registry.md",  "data/resources/banking-finance.md"],
  "insurance":        ["sources/insurance/source-registry.md",        "data/resources/insurance.md"],
  "technology-saas":  ["sources/technology-saas/source-registry.md",  "data/resources/technology-saas.md"],
  "education":        ["sources/education/source-registry.md",        "data/resources/education.md"],
  "real-estate":      ["sources/real-estate/source-registry.md",      "data/resources/real-estate.md"],
  "retail-ecommerce": ["sources/retail-ecommerce/source-registry.md", "data/resources/retail-ecommerce.md"],
  "manufacturing":    ["sources/manufacturing/source-registry.md",    "data/resources/manufacturing.md"],
  "legal-compliance": ["sources/legal-compliance/source-registry.md", "data/resources/legal-compliance.md"],
  "government":       ["sources/government/source-registry.md",       "data/resources/government.md"],
  "_global":          ["data/opportunities/fixed.md"],
};

// Pre-computed flat set for O(1) lookup
const ALLOWED_PATH_SET = new Set<string>(Object.values(EDITABLE_PATHS).flat());

// ── Config ────────────────────────────────────────────────────────────────────

export function getAdminConfig(): AdminConfig {
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    // Merge env-var superusers with config-file superusers
    const envSuperusers = (process.env.ADMIN_SUPERUSER_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...envSuperusers, ...(raw.superusers ?? [])]));
    return { ...raw, superusers: merged };
  } catch {
    const envSuperusers = (process.env.ADMIN_SUPERUSER_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { superusers: envSuperusers, domainExperts: {} };
  }
}

export function saveAdminConfig(config: AdminConfig): void {
  // Never persist env-var superusers back to disk — keep file and env separate
  const envSuperusers = new Set(
    (process.env.ADMIN_SUPERUSER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  );
  const toSave: AdminConfig = {
    ...config,
    superusers: config.superusers.filter((id) => !envSuperusers.has(id)),
  };
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(toSave, null, 2));
}

// ── Access helpers ─────────────────────────────────────────────────────────────

export function isSuperuser(userId: string): boolean {
  return getAdminConfig().superusers.includes(userId);
}

export function hasAnyAdminAccess(userId: string): boolean {
  const config = getAdminConfig();
  if (config.superusers.includes(userId)) return true;
  return Object.values(config.domainExperts).some((users) => users.includes(userId));
}

export function getAccessibleDomains(userId: string): string[] | "all" {
  const config = getAdminConfig();
  if (config.superusers.includes(userId)) return "all";
  const domains: string[] = [];
  for (const [domain, users] of Object.entries(config.domainExperts)) {
    if (users.includes(userId)) domains.push(domain);
  }
  return domains;
}

export function canAccessDomain(userId: string, domain: string): boolean {
  const access = getAccessibleDomains(userId);
  return access === "all" || access.includes(domain);
}

/**
 * Derives the domain from a file path using the EDITABLE_PATHS map.
 * Never trusts client-supplied domain strings for access checks.
 */
export function domainFromPath(relativePath: string): string | null {
  for (const [domain, paths] of Object.entries(EDITABLE_PATHS)) {
    if (paths.includes(relativePath)) return domain;
  }
  return null;
}

// ── Path validation ────────────────────────────────────────────────────────────

/**
 * Two-layer path validation:
 * 1. Exact match in the allowlist (string equality, no globs)
 * 2. path.resolve() bounds check — resolved path must stay within CWD
 * Both must pass.
 */
export function isPathAllowed(relativePath: string): boolean {
  if (!ALLOWED_PATH_SET.has(relativePath)) return false;
  // Null byte check
  if (relativePath.includes("\0")) return false;
  // Resolve and verify it stays inside CWD
  const resolved = path.resolve(CWD, relativePath);
  return resolved.startsWith(CWD + path.sep) || resolved === CWD;
}

// ── Content validation ────────────────────────────────────────────────────────

const MAX_CONTENT_BYTES = 500 * 1024; // 500 KB

export function validateContent(content: unknown): { ok: true; value: string } | { ok: false; reason: string } {
  if (typeof content !== "string") return { ok: false, reason: "content must be a string" };
  if (Buffer.byteLength(content, "utf-8") > MAX_CONTENT_BYTES) return { ok: false, reason: "Content exceeds 500 KB" };
  if (content.includes("\0")) return { ok: false, reason: "Null bytes not allowed" };
  if (/<script[\s>]/i.test(content)) return { ok: false, reason: "Script tags not allowed" };
  if (/javascript\s*:/i.test(content)) return { ok: false, reason: "javascript: URLs not allowed" };
  return { ok: true, value: content };
}

// ── Pending ID validation ─────────────────────────────────────────────────────

const PENDING_ID_RE = /^[a-z0-9]{4,12}-[a-z0-9]{4,8}$/;

export function isValidPendingId(id: string): boolean {
  return PENDING_ID_RE.test(id);
}

// ── Rate limiting (in-memory, resets on cold start) ───────────────────────────

interface RateState { count: number; resetAt: number }
const rateLimits = new Map<string, RateState>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const state = rateLimits.get(key);
  if (!state || now > state.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (state.count >= maxRequests) return false;
  state.count++;
  return true;
}

// ── CSRF protection ────────────────────────────────────────────────────────────

export function verifyCsrf(originHeader: string | null): boolean {
  if (!originHeader) return false;
  try {
    const origin = new URL(originHeader);
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3004");
    // Same origin check
    if (origin.origin === appUrl.origin) return true;
    // Allow any localhost port in development
    if (process.env.NODE_ENV !== "production" && origin.hostname === "localhost") return true;
    return false;
  } catch {
    return false;
  }
}

// ── Audit log ─────────────────────────────────────────────────────────────────

export function logAudit(entry: Omit<AuditEntry, "ts">): void {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
    fs.mkdirSync(path.dirname(AUDIT_LOG), { recursive: true });
    fs.appendFileSync(AUDIT_LOG, line + "\n");
  } catch {
    // Never let audit logging crash the request
  }
}

// ── File operations ────────────────────────────────────────────────────────────

export function readManagedFile(relativePath: string): string | null {
  if (!isPathAllowed(relativePath)) return null;
  try {
    return fs.readFileSync(path.join(CWD, relativePath), "utf-8");
  } catch {
    return null;
  }
}

export function writeManagedFile(relativePath: string, content: string): void {
  if (!isPathAllowed(relativePath)) throw new Error("Path not in allowlist");
  const validation = validateContent(content);
  if (!validation.ok) throw new Error(validation.reason);
  const fullPath = path.join(CWD, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
}

// ── Pending queue ──────────────────────────────────────────────────────────────

export function getPendingChanges(domain?: string): PendingChange[] {
  try {
    fs.mkdirSync(PENDING_DIR, { recursive: true });
    const files = fs.readdirSync(PENDING_DIR).filter((f) => f.endsWith(".json"));
    const all: PendingChange[] = files
      .map((f) => {
        try { return JSON.parse(fs.readFileSync(path.join(PENDING_DIR, f), "utf-8")); }
        catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    return domain ? all.filter((c) => c.domain === domain) : all;
  } catch {
    return [];
  }
}

export function savePendingChange(change: Omit<PendingChange, "id">): PendingChange {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const full: PendingChange = { ...change, id };
  fs.mkdirSync(PENDING_DIR, { recursive: true });
  fs.writeFileSync(path.join(PENDING_DIR, `${id}.json`), JSON.stringify(full, null, 2));
  return full;
}

export function deletePendingChange(id: string): void {
  if (!isValidPendingId(id)) return;
  try { fs.unlinkSync(path.join(PENDING_DIR, `${id}.json`)); } catch {}
}

export function getPendingChange(id: string): PendingChange | null {
  if (!isValidPendingId(id)) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(PENDING_DIR, `${id}.json`), "utf-8"));
  } catch {
    return null;
  }
}

// ── Markdown helpers ──────────────────────────────────────────────────────────

export function parseMarkdownEntries(sectionBody: string): { title: string; block: string }[] {
  const blocks = sectionBody.split(/\n(?=### )/).filter((b) => b.trim());
  return blocks.map((block) => {
    const lines = block.trim().split("\n");
    const title = lines[0].replace(/^### /, "").trim();
    return { title, block: block.trim() };
  }).filter((e) => e.title);
}

export function insertEntry(markdown: string, sectionHeader: string, entryBlock: string): string {
  const sectionRegex = new RegExp(`(## ${escapeRegex(sectionHeader)}[^\\n]*\\n)([\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = sectionRegex.exec(markdown);
  if (!match) return markdown + `\n\n${entryBlock}`;
  const end = match.index + match[0].length;
  return markdown.slice(0, end).trimEnd() + `\n\n---\n\n${entryBlock}\n\n` + markdown.slice(end).trimStart();
}

export function deleteEntry(markdown: string, entryTitle: string): string {
  const escaped = escapeRegex(entryTitle);
  const pattern = new RegExp(`\\n---\\n\\n### ${escaped}[\\s\\S]*?(?=\\n---\\n|\\n## |$)`, "g");
  let result = markdown.replace(pattern, "");
  const pattern2 = new RegExp(`^### ${escaped}[\\s\\S]*?(?=\\n---\\n|\\n## |$)`, "gm");
  result = result.replace(pattern2, "");
  return result.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
