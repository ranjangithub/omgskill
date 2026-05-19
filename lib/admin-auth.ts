/**
 * Admin secondary authentication.
 *
 * Layer 1: Clerk session (existing)
 * Layer 2: PIN → HMAC-signed session cookie (this file)
 *
 * Required env vars:
 *   ADMIN_PIN             – 4-8 digit numeric PIN
 *   ADMIN_SESSION_SECRET  – 32+ random characters, used for HMAC signing
 */

import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_sess";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    // In dev, allow without crashing — but log a clear warning
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET must be set in production (min 16 chars)");
    }
    return "dev-only-insecure-secret-do-not-use";
  }
  return s;
}

export function getAdminPin(): string {
  return (process.env.ADMIN_PIN ?? "").trim();
}

/** Constant-time PIN comparison to prevent timing attacks. */
export function verifyAdminPin(input: string): boolean {
  const pin = getAdminPin();
  if (!pin || !input) return false;
  // Normalize to string comparison over consistent buffers
  const a = Buffer.from(input.trim().slice(0, 16));
  const b = Buffer.from(pin.slice(0, 16));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Creates a signed session token: base64url(userId:expiresAt:HMAC). */
export function createAdminSessionToken(userId: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/**
 * Verifies the token belongs to userId and is not expired.
 * Returns true only when all checks pass.
 */
export function verifyAdminSessionToken(token: string, userId: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    // Format: userId:expiresAt:hmacHex
    const lastColon = decoded.lastIndexOf(":");
    const secondLastColon = decoded.lastIndexOf(":", lastColon - 1);
    if (lastColon < 0 || secondLastColon < 0) return false;

    const tokenUserId = decoded.slice(0, secondLastColon);
    const expiresStr = decoded.slice(secondLastColon + 1, lastColon);
    const sig = decoded.slice(lastColon + 1);

    if (tokenUserId !== userId) return false;
    if (Date.now() > parseInt(expiresStr, 10)) return false;

    const payload = `${tokenUserId}:${expiresStr}`;
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");

    const aBuf = Buffer.from(sig.padEnd(64, "0").slice(0, 64), "hex");
    const bBuf = Buffer.from(expected.padEnd(64, "0").slice(0, 64), "hex");
    return crypto.timingSafeEqual(aBuf, bBuf) && sig === expected;
  } catch {
    return false;
  }
}

/** Cookie attributes for the admin session. */
export function adminCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: SESSION_TTL_MS / 1000, // seconds
    path: "/",
  };
}
