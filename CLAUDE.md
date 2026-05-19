# omgskill.ai

Daily AI intelligence briefings, personalized by industry × role × content goal.
Built with Next.js 15, Clerk, Stripe, Tailwind CSS 4.

## Dev server

```bash
/Users/rajeshranjan/.nvm/versions/node/v20.20.2/bin/node node_modules/.bin/next dev --port 3004
```

Visit: http://localhost:3004

## Skills (Claude Code)

All content generation is done through Claude Code skills — no Anthropic API key needed.

| Skill | What it does |
|---|---|
| `/generate` | Generate today's briefing for one or all industries |
| `/show` | Display a saved briefing |
| `/backfill` | Generate briefings for past dates |
| `/persona` | Preview, compare, or add persona configurations |
| `/sources` | Manage and test RSS feeds per industry |
| `/audit` | Review a generated briefing for quality |

## Skill routing

- Generate content → `/generate [industry] [role]`
- Read a briefing → `/show [industry] [date]`
- Check quality → `/audit [industry]`
- Manage feeds → `/sources [industry]`
- Past dates → `/backfill [N days] [industry]`

## File layout

```
data/
  briefings/
    YYYY-MM-DD/
      {industry}_{role}_{goals}.md   ← generated briefings (gitignored)
      _raw_{industry}.json            ← raw RSS fetch (gitignored)

content-engine/
  strategy.md          ← curation principles
  taxonomy.md          ← industry/role/goal reference
  industries/          ← per-industry context
  roles/               ← per-role framing
  goals/               ← per-goal output instructions
  prompts/             ← AI generation prompts
  source-packs/        ← RSS feeds per industry
  stackdna/            ← industry × role × goal combination profiles
  templates/           ← output format templates

lib/
  mock-briefings.ts    ← 10 industry mocks (shown when no real briefing exists)
  briefing-store.ts    ← read/write .md briefing files
  rss-fetcher.ts       ← RSS fetch utility (used by skills via Python)
  db/                  ← in-memory user/profile store
  personas/            ← taxonomy + prompt files

app/
  dashboard/           ← main briefing viewer
  onboarding/          ← 5-step industry → role → goals → voice → premium
  pricing/             ← Free / Pro / Premium tiers
  settings/            ← account + subscription management
  api/                 ← Stripe webhooks, billing, onboarding endpoint
```

## Pricing tiers

- **Free** — Signals 1–3, no sections
- **Pro ($9/mo)** — All 10 signals + all sections + Drive Time
- **Premium ($29/mo)** — Everything + personalized briefings from LinkedIn context
