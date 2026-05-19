/**
 * POST /api/cron/generate
 *
 * Production nightly trigger — runs `claude -p` with the /generate skill.
 *
 * In development: just run `/generate` from within a Claude Code session.
 * No Anthropic API key needed — Claude Code IS the generator.
 *
 * In production (Vercel Cron at 05:00 UTC):
 *   This route is a placeholder. The recommended production approach is a
 *   GitHub Actions workflow that runs `claude -p "/generate all"` and commits
 *   the resulting .md files back to the repo.
 *
 * See: .github/workflows/generate-briefings.yml
 */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a self-hosted environment with the claude CLI installed,
  // you could shell out: execSync('claude -p "/generate all"')
  // On Vercel, use the GitHub Actions approach instead.

  return NextResponse.json({
    message: "Use GitHub Actions workflow or run /generate locally in Claude Code.",
    docs: "See .github/workflows/generate-briefings.yml",
  });
}
