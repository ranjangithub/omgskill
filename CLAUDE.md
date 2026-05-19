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

| Command | What it does |
|---|---|
| `/omgstack generate healthcare` | Generate today's briefing for an industry |
| `/omgstack generate all` | Generate all 10 industries |
| `/omgstack show healthcare` | Display a saved briefing |
| `/omgstack show list` | List all saved briefings |
| `/omgstack backfill 7 healthcare` | Generate last N days |
| `/omgstack persona healthcare sales sell-better` | Preview a persona |
| `/omgstack sources healthcare` | Test RSS feeds |
| `/omgstack audit healthcare` | Score a briefing for quality |

## Skill routing

- Generate content → `/omgstack generate [industry] [role]`
- Read a briefing → `/omgstack show [industry] [date]`
- Check quality → `/omgstack audit [industry]`
- Manage feeds → `/omgstack sources [industry]`
- Past dates → `/omgstack backfill [N days] [industry]`

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
